import { NextFunction, Request, Response } from "express";
import ServerError from "../errors/server-error.js";
import ProductService from "./products-service.js";
import IProduct from "./IProduct.js";
import IsInterfaceOfProduct from "./isInterfaceOfProduct.js";
import RequestError from "../errors/request-error.js";
import ProductError from "./product-errors.js";
import { propertiesExists } from "./IProduct.js";
import errorSender from "../helpers/error-sender.js";
import ProductSortOptions from "./sortOptions.js";
import productsService from "./products-service.js";
import mongoose from "mongoose";

interface IFilterProductsRequest {
  query: object,
  offset: number,
  sort: string,
  connection: mongoose.Connection
}

interface IDeleteSetOfProductsRequest {
  productsID: string[],
  connection: mongoose.Connection
}

/**
 * provides all the necessary data controlling, related to products
 */
export class ProductsController {
  /**
   * creates product in database.
   * @remarks
   * request's body must contain next fields:
   *  {
   *    product({@link IProduct})
   *  }
   * @param req - request data ({@link https://expressjs.com/en/api.html#req|express request info})
   * @param res - response data ({@link https://expressjs.com/en/api.html#res|express response info})
   * @param next - the next function, executing after middleware done
   * @returns res object, containing status + message
   */
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: IProduct = req.body.product;
      if (!IsInterfaceOfProduct(productData))
        return res
          .status(ProductError.argumentsDoesNotMatchIProduct().status)
          .send(ProductError.argumentsDoesNotMatchIProduct().message);
      const connection: mongoose.Connection = req.body.connection;
      const service = new ProductService(connection);
      await service.createProduct(productData);
      res.status(200).send("product has been created successfully");
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * returns filtered products
   * @param req - request data ({@link https://expressjs.com/en/api.html#req|express request info})
   * @remarks request body must to correspond {@link IFilterProductsRequest} structure
   * @param res - response data ({@link https://expressjs.com/en/api.html#res|express response info})
   * @param next - the next function, executing after middleware done
   * @returns res object, containing filtered {@link IProduct|products} in JSON data format
   */
  async filterProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const requestBody: IFilterProductsRequest = req.body;
      const { query, offset, sort, connection } = requestBody;
      const service = new ProductService(connection);
      const result = await service.filterProducts(query, offset, sort);
      return res.status(200).json(result);
    } catch (error: any) {
      next(error)
    }
  }

  async deleteByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { connection } = req.body;
      const service = new ProductService(connection);
      await service.deleteById(id);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  async getEmptyCells(req: Request, res: Response, next: NextFunction) {
    try {
      const { connection } = req.body;
      const service = new ProductService(connection);
      const result = await service.getEmptyCells();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPagesAmount(req: Request, res: Response, next: NextFunction) {
    try {
      const { connection } = req.body;
      const service = new ProductService(connection);
      const pages = await service.getPagesAmount();
      return res.status(200).json({pages});
    } catch (error) {
      next(error);
    }
  }

  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { field, value, connection } = req.body;
      const service = new ProductService(connection);
      await service.editProduct(id, field, value);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductsController();
