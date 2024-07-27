import { Schema, model } from "mongoose";

export const cartCollectionName = "cart";    

const CartsSchema = new Schema({
    timestamp: {
        type: Number,
        default: Date.now(),
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

export const cartModel = model(cartCollectionName, CartsSchema)