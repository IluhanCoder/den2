import { Express, Request, Response, Router } from "express";
import ProductsController from "./products/products-controller.js";
import requestChecker from "./middlewares/request-checker.js";
import productsController from "./products/products-controller.js";
import userController from "./users/user-controller.js";

const router = Router();
    
router.post("/filter-products", requestChecker.checkBody, ProductsController.filterProducts)
    
router.post(
    "/product",
    requestChecker.checkBody,
    ProductsController.createProduct
);

router.get("/empty-cells", ProductsController.getEmptyCells)

router.delete("/product/:id", ProductsController.deleteByID)

router.get("/pages-amount", productsController.getPagesAmount)

router.put("/product/:id", productsController.editProduct);

router.post("/login", userController.login)

export default router;
