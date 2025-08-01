import express from "express";
const router = express.Router();
import Product from "../models/productModel.js";

router.get("/search", async (req, res) => {
  const q = req.query.q || req.query.search; 
  const regex = new RegExp(q, "i");

  try {
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: { $in: [regex] } },
      ],
    });

    res.json({ products });
  } catch (err) {
    console.error("❌ Search failed:", err);
    res.status(500).json({ message: "Search error", error: err.message });
  }
});
export default router;