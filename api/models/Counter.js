import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // example: "orderNumber"
    seq: { type: Number, default: 0 }
  },
  { versionKey: false }
);

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
