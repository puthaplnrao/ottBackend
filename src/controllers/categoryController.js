import Category from "../models/Category.js";
import slugify from "slugify";

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Category exists" });

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listCategories(req, res) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
