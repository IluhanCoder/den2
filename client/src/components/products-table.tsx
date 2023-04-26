import IProduct from "../interfaces/IProduct"
import userService from "../services/user-service"
import DeleteButton from "./products-table-components/delete-button"
import ExtraLabel from "./products-table-components/extra-label"

interface LocalParams {
    products: IProduct[]
}

const ProductsTable = ({products}: LocalParams) => {
    if(products.length > 0) return <table id="tab">
        <thead>
            <tr>
                <th>id</th>
                <th>номер</th>
                <th>найменування</th>
                <th>опис</th>
                <th>категорія</th>
                <th>вартість в $</th>
                <th>кількість</th>
                <th>статус</th>
            </tr>
        </thead>
        <tbody>
        {products.map((product: IProduct) => {
            return <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.num}</td>
                <td>
                    <ExtraLabel value={product.name} productID={product._id!} type="text" field="name"/>
                </td>
                <td>
                    <ExtraLabel value={product.desc} productID={product._id!} type="text" field="desc"/>
                </td>
                <td>
                    <ExtraLabel value={product.category} productID={product._id!} type="text" field="category"/>
                </td>
                <td>
                    <ExtraLabel value={product.price} productID={product._id!} type="number" field="price"/>
                </td>
                <td>
                    <ExtraLabel value={product.quantity} productID={product._id!} type="number" field="quantity"/>
                </td>
                <td>{product.status}</td>
                <td>
                    {userService.getUserFromLocalStorage().canDelete && <DeleteButton productID={product._id!}/>}
                </td>
            </tr>
        })}
        </tbody>
    </table>
    else return <div><h1 className="text-3xl p-6 text-red-600">Продуктів нема</h1></div>
}

export default ProductsTable;