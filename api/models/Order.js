import mongoose from "mongoose";
import Counter from "./Counter.js";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    productName: { type: String, required: true },
    status: { type: String, enum: ["pending", "processing", "completed"], default: "pending" },
    orderNumber: { type: String, unique: true }
  },
  { timestamps: true }
);

// Safe atomic increment
orderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const counter = await Counter.findOneAndUpdate(
    { id: "orderNumber" },            // which counter to increment
    { $inc: { seq: 1 } },             // increment sequence
    { new: true, upsert: true }       // create if not exists
  );

  this.orderNumber = `ORD-${String(counter.seq).padStart(4, "0")}`;
  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
