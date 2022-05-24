import mongoose from "mongoose";
export default mongoose.model("request", new mongoose.Schema({
    request_list_id: { type: String, required: true },
    ips: { type: Array, required: true },
    email: { type: String, required: true },
    anonymity: { type: Number, default: 0 },
    nickname: { type: String, required: true },
    build: { type: String, required: true },
    additional: { type: String, required: false },
    chosen: { type: Boolean, default: false }
}));