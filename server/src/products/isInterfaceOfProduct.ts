import IProduct from "./IProduct.js";

export default function IsInterfaceOfProduct(object: any): object is IProduct {
  return (
    "name" in object &&
    "desc" in object &&
    "category" in object &&
    "price" in object &&
    "quantity" in object &&
    "status" in object
  );
}
