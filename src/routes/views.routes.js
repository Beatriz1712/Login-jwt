import express from "express";
import ProductManager from "../Mongo/ProductManager.js";
import cartModel from "../Mongo/CartManager.js";
import UserManager from "../Mongo/UserManager.js";

const ViewsRouter = express.Router();
const product = new ProductManager();
const cart = new cartModel();

//Rutas GET para la página de inicio y detalles del producto:

ViewsRouter.get("/products", async (req, res) => {
  if (!req.session.email) {
    res.redirect("/login");
  }

  let allProducts = await product.getProducts();
  allProducts = allProducts.map((product) => product.toJSON());
  const userData = {
    first_name: req.session.first_name,
    last_name: req.session.last_name,
    email: req.session.email,
    role: req.session.role,
  };

  res.render("home", {
    title: "login-passport-github",
    products: allProducts,
    user: userData,
  });
});

ViewsRouter.get("/products/:pid", async (req, res) => {
  let { pid } = req.params.pid;
  let prod = await product.getProductById(pid);

  const productDetail = prod.toObject();

  res.render("prod", {
    title: "Detalle de Producto",
    product: productDetail,
  });
});

ViewsRouter.get("/carts/:cid", async (req, res) => {
  let cid = req.params.cid;
  let products = await cart.getProductsInCart(cid);
  let productObjet = products.toObject();
  res.render("carts", {
    title: "Carrito",
    cart: productObjet,
  });
});

ViewsRouter.get("/register", (req, res) => {
  res.render("register", {
    title: "Registro de Usuario",
  });
});

ViewsRouter.get("/login", (req, res) => {
  res.render("login", {
    title: "Login de Usuario",
  });
});

ViewsRouter.get("/profile", async (req, res) => {
  console.log(req.session.user);
  if (!req.session.email) {
    res.redirect("/login");
    console.log("entre en el if de profile");
  }
  const email = req.session.email;
  const userData = {
    email: email,
    role: "admin",
  };

  res.render("profile", {
    title: "Perfil de Usuario",
    user: userData,
  });
});

export default ViewsRouter;
