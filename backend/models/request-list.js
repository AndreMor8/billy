import mongoose from "mongoose";
export default mongoose.model("request-list", new mongoose.Schema({ enabled: { type: Boolean, default: false } }, { timestamps: { createdAt: true } }));