import mongoose, { Schema } from "mongoose";
import IProduct from "./IProduct.js";

/**
 * descibes {@link https://mongoosejs.com/docs/tutorials/query_casting.html |MongoDB} model of Products in database
 * @param num - numeral index of product. Defines by {@link ProductService} algorythms
 * @param name - name of product
 * @param desc - product's description
 * @param category - product's category
 * @param price - product's price
 * @param quantity - amount of products left at storages
 * @param status - product's status. Is value, which may contain either "For Sale" or "Not available" value
 */
const ProductSchema = new Schema<IProduct>({
  num: {type: Number, unique: true},
  name: String,
  desc: String,
  category: String,
  price: Number,
  quantity: Number,
  status: { type: String, enum: ["For Sale", "Not available"] },
});

export default ProductSchema;
