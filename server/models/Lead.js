import mongoose from "mongoose";
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: "" },
  service: { type: String, default: "General" },
  message: { type: String, required: true, maxlength: 2000 },
  status: { type: String, enum: ["new", "contacted", "in-progress", "closed"], default: "new" }
}, { timestamps: true });
export default mongoose.model("Lead", leadSchema);
