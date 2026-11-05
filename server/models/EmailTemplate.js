import mongoose from "mongoose";
export default mongoose.model("EmailTemplate", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "General" },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  order: { type: Number, default: 1000, index: true }   // position in the customer journey; lower = earlier
}, { timestamps: true }));