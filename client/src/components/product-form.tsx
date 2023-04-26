import { useState } from "react";
import ProductStatuses from "../static/product-statuses";
import IProduct from "../interfaces/IProduct";
import productService from "../services/product-service";
import { stat } from "fs";
import formStyle from "../styles/form";
import buttonStyle from "../styles/button";

const ProductForm = () => {
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [status, setStatus] = useState<string>(ProductStatuses[0]);
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    const submitEvent = () => {
        const event = new CustomEvent("productFormSubmit");
        document.dispatchEvent(event);
    }

    const clearForm = () => {
        setName("");
        setDesc("");
        setCategory("");
        setStatus(ProductStatuses[0]);
        setQuantity(0);
        setPrice(0);
    }

    const handleSubmit = async (event: any) => {
        const product: IProduct = {
            name,
            desc,
            category,
            status,
            quantity,
            price
        };

        try {
            await productService.newProduct(product);
        } catch (error) {
            throw error;
        }

        alert("продукт було успішно додано до бази даних!");
        clearForm();
        submitEvent();
    }

    return <form className={formStyle}>
        <div><label>Назва продукту:</label><input type="text" value={name} onChange={e => setName(e.target.value)}/></div>
        <div><label>Опис продукту:</label><input type="text" value={desc} onChange={e => setDesc(e.target.value)}/></div>
        <div><label>Категорія:</label><input type="text" value={category} onChange={e => setCategory(e.target.value)}/></div>
        <div><label>Статус:</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                {ProductStatuses.map((status: string) => {
                    return <option value={status} key={status}>{status}</option>
                })}
            </select>
        </div>
        <div><label>Кількість:</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}/></div>
        <div><label>Вартість:</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}/></div>
        <button type="button" onClick={handleSubmit} className={buttonStyle}>додати продукт</button>
    </form>
}

export default ProductForm;