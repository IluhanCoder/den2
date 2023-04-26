export class ProductSortError extends Error {
    status;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "ProductSortError";
      this.status = status;
    }

    static noOption() {
        return new ProductSortError("Product sort has no provided option", 400);
    }
}

/**
 * describes all supported sorting options. Each option contains corresponding {@link https://mongoosejs.com/docs/tutorials/query_casting.html |MongoDB} query
 */
const ProductSortOptions = {
    num: { num: 1 },
    numBackw: { num: -1 },
    name: { name: 1 },
    nameBackw: { name: -1 },
    price: { price: 1 },
    priceBackw: { price: -1 },
    quantity: { quantity: 1 },
    quantityBackw: { quantity: -1 }
};

export default ProductSortOptions;