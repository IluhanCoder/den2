import { useEffect, useState } from "react";
import productService from "../../services/product-service";

const usePagesAmount = () => {
  const [pagesAmount, setPagesAmount] = useState<number>(0);

  const getPagesAmount = async () => {
    setPagesAmount(await productService.getPagesAmount());
  };

  useEffect(() => {
    document.addEventListener("productFormSubmit", () => getPagesAmount());
    document.addEventListener("onProductDelete", () => getPagesAmount());
  }, []);

  useEffect(() => {
    getPagesAmount();
  }, []);

  return pagesAmount;
};

export default usePagesAmount;
