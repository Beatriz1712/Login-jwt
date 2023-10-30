import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: { type: Number, required: true },
        },
    ],
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
