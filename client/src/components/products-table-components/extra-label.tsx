import { useEffect, useState } from "react"
import IProduct from "../../interfaces/IProduct"
import productService from "../../services/product-service";
import userService from "../../services/user-service";

interface LocalParams {
    productID: string,
    value: string | number,
    type: string,
    field: string
}

const ExtraLabel = ({productID, value, type, field}: LocalParams) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [newValue, setNewValue] = useState<string|number>(value);

    const activateInput = () => {
        if(!userService.getUserFromLocalStorage().canEdit) return;
        setEditMode(true);
    }

    const onEditEvent = () => {
        const event = new CustomEvent("onProductEdit");
        document.dispatchEvent(event);
    }

    const handleBlur = async () => {
        setEditMode(!editMode);
        await productService.editProduct(productID, field, newValue);
        onEditEvent();
    }

    useEffect(() => {
        if(editMode) document.getElementById("edit-input")?.focus();
    }, [editMode])

    if(editMode) {
        return <input id="edit-input" type={type} onBlur={handleBlur} value={newValue} onChange={e => setNewValue(e.target.value)}/>
    }
    else return <label onClick={activateInput}>{value}</label>
}

export default ExtraLabel;