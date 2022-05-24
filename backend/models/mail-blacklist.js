import mongoose from "mongoose";
export default mongoose.model("blacklist", new mongoose.Schema({
    email: { type: String, required: true }
}));