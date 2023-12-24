import express, { json } from "express";
import ProductManager from "../controlers/ProductManager.js";
import cartModel from "../controlers/CartManager.js";
import UserManager from "../controlers/UserManager.js";

const ViewsRouter = express.Router()
const product = new ProductManager()
const cart = new cartModel()
const user = new UserManager()

//Rutas GET para la página de inicio y detalles del producto:

ViewsRouter.get("/products", async (req, res) => {
    if (!req.session.email) {
        res.redirect("/login")
    }

    let allProducts = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON())
    const userData = {
        name: req.session.name,
        surname: req.session.surname,
        email: req.session.email,
        role: req.session.role
    }

    res.render("home", {
        title: "Home",
        products: allProducts,
        user: userData

    })
})

ViewsRouter.get("/products/:id", async (req, res) => {

    let productId = req.params.id
    let prod = await product.getProductById(productId)

    const productDetail = prod.toObject();

    res.render("prod", {
        title: "Detalle de Producto",
        product: productDetail
    })
})

ViewsRouter.get("/carts/:cid", async (req, res) => {
    let cartId = req.params.cid
    let products = await cart.getProductsInCart(cartId)
    let productObjet = products.toObject()
    res.render("carts", {
        title: "Carrito",
        cart: productObjet
    })
})

ViewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

ViewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login de Usuario"
    })
})

ViewsRouter.get("/profile", async (req, res) => {
    let userJson = JSON.stringify(req.session.user)
    let user = req.session.user
    let email = user.email
    console.log(`el usuario de la session /profile: ${userJson}`);
    console.log(`el email de la session /profile: ${email}`);
    if (!user || !user.email) {
        res.redirect("/login")
        console.log("entre en el if de /profile")
    }
    // const email = req.session.email
    const userData = {
        email: email,
        role: "admin"
    }

    res.render("profile", {
        title: "Perfil de Usuario",
        user: userData
    })
})

export default ViewsRouter