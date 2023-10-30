import express from "express";
import ProductManager from "../Mongo/ProductManager.js";
import cartModel from "../Mongo/CartManager.js";
import UserManager from "../Mongo/UserManager.js";

const ViewsRouter = express.Router();
const product = new ProductManager();
const cart = new cartModel();
const user = new UserManager();

//Rutas GET para la página de inicio y detalles del producto:

ViewsRouter.get("/products", async (req, res) => {
  if (!req.session.email) {
    res.redirect("/login");
  }

  let allProducts = await product.getProducts();
  allProducts = allProducts.map((product) => product.toJSON());
  const userData = {
    name: req.session.name,
    surname: req.session.surname,
    email: req.session.email,
    role: req.session.role,
  };

  res.render("home", {
    title: "login-jwt",
    products: allProducts,
    user: userData,
  });
});

ViewsRouter.get("/products/:id", async (req, res) => {
  let productId = req.params.id;
  let prod = await product.getProductById(productId);

  const productDetail = prod.toObject();

  res.render("prod", {
    title: "Detalle de Producto",
    product: productDetail,
  });
});

ViewsRouter.get("/carts/:cid", async (req, res) => {
  let cartId = req.params.cid;
  let products = await cart.getProductsInCart(cartId);
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
