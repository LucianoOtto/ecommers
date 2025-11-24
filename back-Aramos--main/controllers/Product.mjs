import Product from "./models/Product.mjs";

export const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { title, description, price, stock } = req.body;

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    userId: req.user.id
  });

  res.json({ msg: "Producto creado", product });
};