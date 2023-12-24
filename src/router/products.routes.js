import { Router } from "express";
import productModel from "../dao/models/product.model.js";
import ProductManager from "../controlers/ProductManager.js";

const router = Router();
const products = new ProductManager();

router.get("/", async (req, res) => {
    let sortOrder = req.query.sortOrder || "asc";
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10
    let category = req.query.category || "";
    let availability = req.query.availability || "";

    res.send(await products.getProductMaster(page, limit, category, availability, sortOrder))
})

router.get("/:pid", async (req, res) => {
    try {
        const prodId = req.params.pid;
        const productDetails = await products.getProductById(prodId);
        res.send({ product: productDetails });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto 2' });
    }
})

router.post("/", async (req, res) => {
    let {
        name, description, price, category, stock, thumbnail } = req.body;

    if (!name || !description || !price || !category || !stock || !thumbnail) {
        return res.send({ status: "error", error: "Incomplete values" })
    }
    let result = await productModel.create({
        name,
        description,
        price,
        category,
        stock,
        thumbnail
    })
    res.send({ result: "success", payload: result })
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;
    let productToReplace = req.body;
    if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail) {
        return res.send({ status: "error", error: "Incomplete values" })
    }
    let result = await productModel.updateOne({ _id: pid }, productToReplace);
    res.send({ result: "success", payload: result })
})

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result })
})

router.get("/limit/:limit", async (req, res) => {
    let limit = parseInt(req.params.limit)
    if (isNaN(limit) || limit <= 0) {
        limit = 10
    } res.send(await products.getProductByLimit(limit))
})

router.get("/page/:page", async (req, res) => {
    let page = parseInt(req.params.page)
    if (isNaN(page) || page <= 0) {
        page = 1
    }
    const productsPerPage = 1
    res.send(await products.getProductByPage(page, productsPerPage))
})

router.get("/query/:query", async (req, res) => {
    let query = req.params.query
    res.send(await products.getProductByQuery(query))
})



export default router;