import mongoose, { Mongoose, Types } from "mongoose";
import IProduct, { propertiesExists } from "./IProduct.js";
// import ProductModel from "./product-model.js";
import IsInterfaceOfProduct from "./isInterfaceOfProduct.js";
import ProductError from "./product-errors.js";
import ProductSortOptions, { ProductSortError } from "./sortOptions.js";
import errorSender from "../helpers/error-sender.js";
import ProductSchema from "./product-schema.js";
import table from "text-table";
import { createWriteStream, writeFileSync } from "fs";
import docx from "docx";

/**
 * checks if product with given *num* field exists in array
 * @param array - array of products ({@link IProduct}[])
 * @param number - value of number you want to check
 * @returns
 * *true* - if product exists.
 * *false* - if product does not exists
 */
function numDoesExist(array: IProduct[], number: number): boolean {
  return array.some((product: IProduct) => {
    return product.num == number;
  });
}

/**
 * @desc provides all the necessary DB functionality, related to products
 */
class ProductService {
  ProductModel;

  constructor(dbConnection: mongoose.Connection) {
    dbConnection.model("Product", ProductSchema);
    this.ProductModel = dbConnection.models.Product;
  }

  /**
   * finds smallest "free" num field value in database
   * @returns value of found "free" num
   */
  async getFreeNum() {
    let products: IProduct[];
    products = await this.ProductModel.find();
    let i: number;
    for (i = 0; numDoesExist(products, i); i++);
    return i;
  }

  /**
   * @desc adds a new entry into Products collection
   * @param data - product you want to add into database
   * @returns created product data
   */
  async createProduct(data: IProduct): Promise<IProduct> {
    try {
      return await this.ProductModel.create({
        num: await this.getFreeNum(),
        ...data,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * deletes product with specified ID from database
   * @param productId - ID of Product you want to remove form database ({@link https://mongoosejs.com/docs/schematypes.html#objectids| mognoose.types.objectID})
   */
  async deleteProductById(productId: Types.ObjectId) {
    try {
      await this.ProductModel.findByIdAndDelete(productId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * checks if product with provided ID exists in database
   * @param productId - ID of Product you want to check in database
   * @returns
   * *true* - if product exists.
   * *false* - if product does not exist
   */
  async IDExists(productId: Types.ObjectId): Promise<boolean> {
    try {
      const product = await this.ProductModel.findById(productId);
      return product !== null && product !== undefined;
    } catch (error) {
      throw error;
    }
  }

  /**
   * filters and returns Products from database
   * @param query - filter query based on {@link https://mongoosejs.com/docs/tutorials/query_casting.html |MongoDB syntax}
   * @param offset - amount of data chunks to skip. Chunk length must be described at {@link https://www.npmjs.com/package/dotenv |.env} file as DATA_CHUNK_LEN variable
   * @param sort - sorting type. All of available options described at {@link ProductSortOptions} object. Sort is {@link ProductSortOptions.num|"num"} by default, which means products are being sorted by it's num field ascending
   * @returns array of {@link IProduct} objects
   */
  async filterProducts(
    query: object | any,
    offset: number,
    sort: string = "num"
  ): Promise<IProduct[]> {
    try {
      if (ProductSortOptions[sort] === undefined)
        throw ProductSortError.noOption();
      const chunkLen: number = parseInt(process.env.DATA_CHUNK_LEN);
      const offsetStart = offset * chunkLen;
      if (Types.ObjectId.isValid(query._id))
        query._id = new Types.ObjectId(query._id);
      const data = await this.ProductModel.find(query)
        .skip(offsetStart)
        .limit(chunkLen)
        .sort(
          sort === undefined ? ProductSortOptions.num : ProductSortOptions[sort]
        );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(productId: string) {
    try {
      const convertedID: Types.ObjectId = new Types.ObjectId(productId);
      return await this.ProductModel.deleteOne({ _id: convertedID });
    } catch (error) {
      throw error;
    }
  }

  async getEmptyCells() {
    try {
      return await this.ProductModel.aggregate([
        {
          $match: {
            $or: [
              { name: "" },
              { desc: "" },
              { category: "" },
              { status: "" },
              { quantity: null },
              { price: null },
            ],
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getPagesAmount() {
    const chunkLen = parseInt(process.env.DATA_CHUNK_LEN);
    try {
      return Math.ceil((await this.ProductModel.find()).length / chunkLen);
    } catch (error) {
      throw error;
    }
  }

  async editProduct(productId: string, field: string, value: any) {
    try {
      const editQuery = {};
      editQuery[field] = value;
      return await this.ProductModel.updateOne(
        { _id: new Types.ObjectId(productId) },
        editQuery
      );
    } catch (error) {
      throw error;
    }
  }

  async formReport(format: string) {
    type ReportItem = {
      data: IProduct;
      wrongFields: string[];
    };

    type QueryCondition = {
      key: string;
      value: string | object;
    };

    const wrongFieldsQuery: QueryCondition[] = [
      { key: "name", value: "" },
      { key: "desc", value: "" },
      { key: "category", value: "" },
      { key: "price", value: { $lt: 0 } },
      { key: "quantity", value: { $lt: 0 } },
      { key: "status", value: "" },
    ];

    const generateTable = (data: ReportItem[]): string[][] => {
      let textData: string[][] = [
        [
          "id",
          "номер",
          "найменування",
          "опис",
          "категорія",
          "варстість",
          "кількість",
          "статус",
        ],
      ];
      data.map((item: ReportItem) => {
        let row = [];
        const product = item.data;
        Object.keys(product).map((key: string) => {
          if (item.wrongFields.includes(key)) {
            row = [...row, `!!!${product[key]}!!!`];
          } else row = [...row, product[key]];
        });
        textData = [...textData, row];
      });
      return textData;
    };

    const generateTxt = (reportItems: ReportItem[]) => {
      const text = table(generateTable(reportItems), {
        align: ["c", "c", "c", "c", "c", "c", "c", "c"],
      });
      const writeStream = createWriteStream("report.txt");
      writeStream.write("Записи в базі, в яких було виявлено помилки:\n\n");
      writeStream.write(text);
      writeStream.end();
    };

    // const generateDocx = (reportItems: ReportItem[]) => {
    //   const {
    //     Document,
    //     Packer,
    //     Paragraph,
    //     TextRun,
    //     Table,
    //     TableRow,
    //     TableCell,
    //     WidthType,
    //     ShadingType
    //   } = docx;

    //   let tableData = []; 
    //   reportItems.map((item: ReportItem) => {
    //     let cells = [];
    //     const data = item.data;
    //     Object.keys(data).map((key: string) => {
    //       const cellTemplate = {
    //         children: [new Paragraph(data[key])],
    //         shading: undefined
    //       }

    //       if(item.wrongFields.includes(key)) {
    //         cellTemplate.shading = {
    //           fill: "b79c2f",
    //           type: ShadingType.REVERSE_DIAGONAL_STRIPE,
    //           color: "auto",
    //         }
    //       }
    //       const cell = new TableCell({
    //         cellTemplate
    //       });
    //       cells = [...cells, cell]
    //     })
    //     const row = new TableRow({
    //       children: cells
    //     });
    //     tableData = [...tableData, row];
    //   })

    //   const table = new Table({
    //     rows: [
    //       new TableRow({
    //         children: [
    //           new TableCell({
    //             children: [new Paragraph("id")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("номер")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("найменування")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("опис")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("категорія")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("вартість")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("кількість")],
    //           }),
    //           new TableCell({
    //             children: [new Paragraph("статус")],
    //           }),
    //         ],
    //         ...tableData
    //       }),
    //     ],
    //   });

    //   const doc = new Document({
    //     sections: [
    //       {
    //         children: [
    //           new Paragraph({ text: "Table with skewed widths" }),
    //           table,
    //         ],
    //       },
    //     ],
    //   });

    //   Packer.toBuffer(doc).then((buffer) => {
    //     writeFileSync("My Document.docx", buffer);
    //   });
    // };

    const formReportItemsArray = (products: IProduct[]) => {
      let reportItems: ReportItem[] = [];
      products.map((product: IProduct) => {
        let wrongFields: string[] = [];
        wrongFieldsQuery.map((condition: QueryCondition) => {
          const fieldValue = product[condition.key];
          if (
            (typeof fieldValue === "string" &&
              fieldValue === condition.value) ||
            fieldValue < 0
          ) {
            wrongFields = [...wrongFields, condition.key];
          }
        });
        reportItems = [...reportItems, { data: product, wrongFields }];
      });
      return reportItems;
    };

    try {
      let query: object[] = [];
      wrongFieldsQuery.map((condition: QueryCondition) => {
        const newItem = {};
        newItem[condition.key] = condition.value;
        query = [...query, newItem];
      });

      const wrongProducts: IProduct[] = await this.ProductModel.aggregate([
        {
          $match: {
            $or: query,
          },
        },
      ]);

      const reportItems: ReportItem[] = formReportItemsArray(wrongProducts);

      switch (format) {
        case "txt":
          generateTxt(reportItems);
        // case "docx":
        //   generateDocx(reportItems);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default ProductService;
