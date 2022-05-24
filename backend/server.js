import 'dotenv/config.js';
import { readFileSync } from 'fs';
import express from 'express';
import JwtExpress from 'express-jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import isEmail from '@nickgatzos/is-email';
import requests from './models/requests.js';
import requestList from './models/request-list.js';
import mailBlacklist from './models/mail-blacklist.js';
const vmp = readFileSync("./verification_message.txt", "utf8");
const jwtManager = new JwtExpress({
    jwt: {
        secret: process.env.SECRET,
        options: {
            //DON'T FORGET TO SET EXPIREIN UNDEFINED ON userParams
            issuer: process.env.DOMAIN,
        }
    }
});
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ADDRESS,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.NODE_ENV === "development" ? "*" : process.env.DOMAIN);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.set("trust proxy", process.env.NODE_ENV !== "development");
await mongoose.connect(process.env.MDB_PATH).then(() => console.log("Connected to database")).catch(console.error);
const temp_tokens = new Map();

app.get("/", async (req, res) => {
    res.status(200).json({ message: "Hello world!" });
});

app.post("/do-request", async (req, res) => {
    //Data check
    if (!req.body?.email) return res.status(400).json({ message: "You must provide a valid e-mail!" });
    if (typeof req.body.email !== "string") return res.status(400).json({ message: "You must provide a valid e-mail!" });
    if (!isEmail(req.body.email)) return res.status(400).json({ message: "You must provide a valid e-mail!" })
    if (!req.body.nickname) return res.status(400).json({ message: "You must provide a nickname!" });
    if (typeof req.body.nickname !== "string") return res.status(400).json({ message: "You must provide a nickname!" });
    if (typeof req.body.anonymity !== "number") return res.status(400).json({ message: "Provide a correct anonymity number!" });
    if (!([0, 1, 2].includes(req.body.anonymity))) return res.status(400).json({ message: "Incorrect anonymity number!" });
    if (!req.body.build) return res.status(400).json({ message: "You must provide a Windows build!" });
    if (typeof req.body.build !== "string") return res.status(400).json({ message: "You must provide a Windows build!" });
    if (typeof req.body.additional !== "string") return res.status(400).json({ message: "Provide correct 'additional' data!" });

    if (req.headers["authorization"]) {
        try {
            const data = jwtManager.verify(req.headers["authorization"].slice(7));
            const doc = await requests.findById(data.doc_id).lean();
            if (!doc) return res.status(404).json({ message: "Can't find that request... Maybe I'm broken or Billy deleted the requests. Returning to blank form..." });
            if (!doc.chosen) {
                await requests.findByIdAndUpdate(data.doc_id, { $set: { nickname: req.body.nickname, anonymity: req.body.anonymity, build: req.body.build, additional: req.body.additional } }, { new: true, lean: true });
                return res.status(200).json({ message: "Build request updated!" });
            }
        } catch (err) {
            return res.status(403).json({ message: "Invalid token.", err: err.toString() })
        }
    }

    const ip = process.env.NODE_ENV === "development" ? req.ip : req.headers["cf-connecting-ip"];
    const pre_doc = await requests.findOne({ ips: { $elemMatch: { $eq: ip } }, chosen: { $eq: false } }).lean();
    if (pre_doc && !req.body.resend) return res.status(403).json({ message: "You cannot send more than 2 requests! Try again to change your data and request.", resend: true });

    //generate temporal hash for verify email
    const dateForHash = (new Date()).valueOf().toString();
    const createRandomNum = Math.random().toString();
    const temp_token = crypto.createHash('sha1').update(dateForHash + createRandomNum).digest('hex');

    temp_tokens.set(temp_token, { ip, existing_doc: pre_doc?._id || null, email: req.body.email, nickname: req.body.nickname, anonymity: req.body.anonymity, build: req.body.build, additional: req.body.additional });

    //send verification email
    const bl = await mailBlacklist.findOne({ email: req.body.email }).lean();
    if (!bl) await transporter.sendMail({ from: "billy@andremor.dev", to: req.body.email, subject: "E-mail verification", text: vmp.replace("<USERNAME>", req.body.nickname).replace("<LINK_GO>", `${process.env.DOMAIN}/verify?token=${temp_token}`).replace("<LINK_BLACKLIST>", `${process.env.DOMAIN}/blacklist?token=${temp_token}`).replaceAll("<DOMAIN>", process.env.DOMAIN).replace("<YEAR>", (new Date().getFullYear())) });
    res.status(200).json({ message: "Email verification send. Please check your inbox ;)" });
});

app.post("/verify", async (req, res) => {
    if (!req.body.token) return res.status(400).json({ message: "Provide a temporal verification token!" });
    if (typeof req.body.token !== "string") return res.status(400).json({ message: "Provide a temporal verification token!" });
    const data = temp_tokens.get(req.body.token);
    if (!data) return res.status(404).json({ message: "Token not found..." });
    if (data.existing_doc) {
        const doc = await requests.findByIdAndUpdate(data.existing_doc, { $set: { email: data.email, nickname: data.nickname, anonymity: data.anonymity, build: data.build, additional: data.additional } }, { new: true, lean: true });
        if (doc) {
            temp_tokens.delete(req.body.token);
            return res.status(200).json({ message: "Request modified.", token: jwtManager.sign({ doc_id: doc._id }) });
        }
    }
    const doc = await requests.findOne({ email: { $eq: data.email }, chosen: false });
    if (doc) {
        if (!doc.ips.includes(data.ip)) await doc.updateOne({ $push: { ips: data.ip }, $set: { nickname: data.nickname, anonymity: data.anonymity, build: data.build, additional: data.additional } });
        else await doc.updateOne({ $set: { nickname: data.nickname, anonymity: data.anonymity, build: data.build, additional: data.additional } });
        temp_tokens.delete(req.body.token);
        return res.status(200).json({ message: "Request modified.", token: jwtManager.sign({ doc_id: doc._id }) });
    }
    const list = await requestList.findOne({ enabled: true }).lean();
    if (!list) return res.status(403).json({ message: "Without request list..." });
    const new_doc = await requests.create({
        request_list_id: list._id,
        ips: [data.ip],
        email: data.email,
        nickname: data.nickname,
        anonymity: data.anonymity,
        build: data.build,
        additional: data.additional,
        chosen: false
    });
    temp_tokens.delete(req.body.token);
    return res.status(200).json({ message: "Request created.", token: jwtManager.sign({ doc_id: new_doc._id }) });
});

app.post("/blacklist", async (req, res) => {
    if (!req.body.token) return res.status(400).json({ message: "Provide a temporal verification token!" });
    if (typeof req.body.token !== "string") return res.status(400).json({ message: "Provide a temporal verification token!" });
    const data = temp_tokens.get(req.body.token);
    if (!data) return res.status(404).json({ message: "Token not found..." });
    await mailBlacklist.create({ email: data.email });
    res.status(200).json({ message: "Added to mail blacklist." });
});

app.get("/check-active-request-list", async (req, res) => {
    res.status(200).json({ enabled: !!(await requestList.findOne({ enabled: true }).lean().exec()) });
});

app.get("/get-token-info", jwtManager.middleware(), async (req, res) => {
    const doc = await requests.findById(req.user.doc_id).lean();
    if (doc.chosen) return res.status(401).json({ message: "That request was already marked as chosen...", clearToken: true });
    const ip = process.env.NODE_ENV === "development" ? req.ip : req.headers["cf-connecting-ip"];
    if (!doc) return res.status(404).json({ message: "Valid token but document not found..." });
    if (!doc.ips.includes(ip)) await requests.findByIdAndUpdate(req.user.doc_id, { $push: { ips: data.ip } }, { new: true, lean: true });
    res.status(200).json({ email: doc.email, nickname: doc.nickname, anonymity: doc.anonymity, build: doc.build, additional: doc.additional });
});

app.get("/requests", async (req, res) => {
    let token = {};
    try {
        token = jwtManager.verify(req.headers["authorization"]?.slice(7) || "");
    } catch (_e) { };
    const list = await requestList.findOne({ enabled: true }).lean();
    if (!list) return res.status(403).send({ message: "Without request list..." });
    const r = await requests.find({ request_list_id: list._id }, { request_list_id: 0, ips: 0, email: 0 }).lean();
    for (const i in r) {
        if (r[i].anonymity == 1 && !r[i].chosen) {
            r[i].nickname = "<redacted>";
        }
        if (r[i].anonymity == 2) {
            r[i].nickname = "<redacted>";
        }
        if (r[i]._id === token._id) {
            r[i].fromUser = true;
        }
    };
    res.status(200).json(r.sort((a, b) => {
        if (a.fromUser && b.fromUser) return 0;
        if (a.fromUser && !b.fromUser) return -1;
        if (!a.fromUser && b.fromUser) return 1;
        if (a.chosen && b.chosen) return 0;
        if (a.chosen && !b.chosen) return -1;
        if (!a.chosen && b.chosen) return 1;
        return 0;
    }));
});

const listener = app.listen(process.env.PORT || 3075, () => {
    console.log(`App listening on port ${listener.address().port}`);
});