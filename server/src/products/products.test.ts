import mongoose from 'mongoose';
import connectToDataBase from '../db/connectToDB.js';
import IProduct from './IProduct.js';
import productsService from './products-service.js';
import ProductSortOptions from './sortOptions.js';

describe('Testing products DB', () => {
    const dbConn = process.env.DB_CONN;
    beforeAll(async () => await connectToDataBase(dbConn));

    const productData1: IProduct = {
        name: "test",
        desc: "this is a test product",
        category: "test",
        price: 228,
        quantity: 1,
        status: "For Sale"
    }

    const productData2: IProduct = {
        name: "test2",
        desc: "this is a test product 2",
        category: "test2",
        price: 1000,
        quantity: 100,
        status: "For Sale"
    }

    test("product creates Successfully", async () => {
        const { _id } = await productsService.createProduct(productData1);
        const productExists = await productsService.IDExists(_id);
        await productsService.deleteProductById(_id);
        expect(productExists).toBe(true);
    })

    test("product num is increasing correctly", async() => {
        const product1 = await productsService.createProduct(productData1);
        const product2 = await productsService.createProduct(productData1);
        await productsService.deleteProductById(product1._id);
        await productsService.deleteProductById(product2._id);
        expect(product2.num - product1.num).toBe(1);
    })

    test("connect to database with wrong connection string throws error", async() => {
        try {
            await connectToDataBase("");
        }
        catch(error) {
            expect(error !== undefined).toBe(true);
        }
    })

    test("filtering works properly", async() => {
        const product1 = await productsService.createProduct(productData1);
        const product2 = await productsService.createProduct(productData1);
        const conditions1 = {
            name: product1.name,
            price: {"$gte": product1.price}
        }
        const conditions2 = {
            price: {"$lt": 800}
        }
        const filteredResult1 = await productsService.filterProducts(conditions1, 0);
        const filteredResult2 = await productsService.filterProducts(conditions2, 0);
        await productsService.deleteProductById(product1._id);
        await productsService.deleteProductById(product2._id);
        
        const result1IsRight = filteredResult1.some((prod: IProduct) => {
            return prod.name === product1.name && prod.price >= product1.price;
        });
        const result2IsRight = filteredResult2.some((prod: IProduct) => {
            return prod.price < 800;
        })
        
        expect(result1IsRight && result2IsRight).toBe(true);
    })

    // test("deletes multiple products", async() => {
    //     const product1 = await productsService.createProduct(productData1);
    //     const product2 = await productsService.createProduct(productData2);
    //     const product3 = await productsService.createProduct(productData1);
    //     const product4 = await productsService.createProduct(productData2);

    //     const IDArray: string[] = [product1._id.toString(), product2._id.toString(), product3._id.toString(), product4._id.toString()];

    //     await productsService.deleteSetOfProducts(IDArray);

    //     const result = IDArray.some(async (id: string) => {
    //         return await productsService.IDExists(new mongoose.Types.ObjectId(id));
    //     })

    //     expect(result).toBe(false);
    // })
})