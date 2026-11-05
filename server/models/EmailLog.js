import mongoose from "mongoose";
export default mongoose.model("EmailLog", new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  to: String, toName: String, subject: String, html: String,
  template: { type: String, default: "Custom" },
  status: { type: String, enum: ["sent", "failed"], default: "sent" },
  attachments: [{ _id: false, name: String, size: Number }],
  error: String
}, { timestamps: true }));
