// import supertest from "supertest"
// import IProduct from "./products/IProduct.js"
// import productsService from "./products/products-service.js"
// import startServer from "./startServer.js"

// const productData1: IProduct = {
//     name: "test",
//     desc: "this is a test product",
//     category: "test",
//     price: 228,
//     quantity: 1,
//     status: "For Sale"
// }

// describe("testing HTTP requests", () => {
//     let app;
//     beforeAll(async () => app = startServer());

//     test("GET /filter-products", async () => {
//         const requestBody = {
//             offset: 0,
//             filter: {
//                 name: "test",
//                 desc: "this is a test product",
//                 category: "test",
//                 price: 228,
//                 quantity: 1,
//                 status: "For Sale"
//             }
//         } 
        
//         const product1 = await productsService.createProduct(productData1);
//         const requestResult = await supertest(app).post("/filter-products").send(requestBody).set('Accept', 'application/json').then(res => {
//             res.body.some((product: IProduct) => {
//                 for(let [key, value] of Object.entries(product)) {
//                     return product[key] === product1[key];
//                 }
//             });
//         });
//         await productsService.deleteProductById(product1._id);

//         expect(requestResult).toBe(true);
//     })
// })