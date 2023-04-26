import productService from "../../services/product-service"
import buttonStyle from "../../styles/button";

interface LocalParams {
    productID: string
}

const DeleteButton = ({productID}: LocalParams) => {
    const onDeleteEvent = () => {
        const event = new CustomEvent("onProductDelete");
        document.dispatchEvent(event);
    }

    const deleteHandler = async () => {
        await productService.deleteProductByID(productID);
        onDeleteEvent();
    }

    return <button id="del-button" name="del-button" type="button" onClick={deleteHandler} className={buttonStyle}>
        видалити
    </button>
}

export default DeleteButton;