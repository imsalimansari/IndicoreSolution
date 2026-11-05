import mongoose from "mongoose";
export default mongoose.model("Project", new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: "Web" },
  summary: { type: String, default: "" },
  problem: { type: String, default: "" },
  sector: { type: String, default: "" },
  tech: [String],
  image: { type: String, default: "" },
  link: { type: String, default: "" },
  icon: { type: String, default: "🚀" },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  isDemo: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true }));
