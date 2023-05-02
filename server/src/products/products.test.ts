import mongoose from "mongoose";
import connectToDataBase from "../db/connectToDB.js";
import IProduct from "./IProduct.js";
import productsService from "./products-service.js";
import ProductSortOptions from "./sortOptions.js";
import ProductService from "./products-service.js";

describe("Testing products DB", () => {
  const connString = process.env.DB_CONN;
  let connection: mongoose.Connection = null;
  beforeAll(async () => connection = await connectToDataBase(connString));

  const productData1: IProduct = {
    name: "test",
    desc: "this is a test product",
    category: "test",
    price: 228,
    quantity: 1,
    status: "For Sale",
  };

  const productData2: IProduct = {
    name: "test2",
    desc: "this is a test product 2",
    category: "test2",
    price: 1000,
    quantity: 100,
    status: "For Sale",
  };

  test("product data is correct", async () => {
    //з'єднання з базою
    const service = new ProductService(connection);
    //створення продукту
    const product: IProduct = await service.createProduct(productData1);
    //перевірка, чи створився продукт
    const productExists = await service.IDExists(product._id);
    //перевірка на коректність створених даних
    const productCorrect = 
      product.name.length > 0 &&
      product.desc.length > 0 &&
      product.status.length > 0 &&
      product.price >= 0 && typeof(product.price) === "number" &&
      product.quantity >= 0 && typeof(product.quantity) === "number";
    //видалення продукту з бази
    await service.deleteProductById(product._id);
    //передача результату тесту
    expect(productExists && productCorrect).toBe(true);
  });

  test("product num is increasing correctly", async () => {
    //з'єднання з базою
    const service = new ProductService(connection);
    //створення першого продуктів
    const product1 = await service.createProduct(productData1);
    const product2 = await service.createProduct(productData1);
    //видалення продуктів
    await service.deleteProductById(product1._id);
    await service.deleteProductById(product2._id);
    //перевірка, щоб різниця в нумерації була 1
    expect(product2.num - product1.num).toBe(1);
  });
});
