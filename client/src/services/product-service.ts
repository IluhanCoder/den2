import $api from "../http/http"
import IProduct from "../interfaces/IProduct"
import IQuery from "../interfaces/IQuery";

export default new class ProductService{
    async deleteProductByID(productID: string) {
        try {
            return await $api.delete(`/product/${productID}`);
        } catch (error) {
            throw error;
        }
    }

    async filterProducts(filterQuery: IQuery, offset: number, sort: string) {
        try {
            const query: IQuery = {};
            if(filterQuery._id) query._id = filterQuery._id;
            if(filterQuery.nameString && filterQuery.nameString.length > 0) query.name = { "$regex": filterQuery.nameString };
            if(filterQuery.descString && filterQuery.descString.length > 0) query.desc = { "$regex": filterQuery.descString };
            if(filterQuery.category && filterQuery.category.length > 0) query.category = filterQuery.category;
            if(filterQuery.status) query.status = filterQuery.status;
            if(filterQuery.quantityStart && filterQuery.quantityEnd) {
                query.quantity = { "$gte": filterQuery.quantityStart, "$lte": filterQuery.quantityEnd }
            }
            if(filterQuery.priceStart && filterQuery.priceEnd) {
                query.price = { "$gte": filterQuery.priceStart, "$lte": filterQuery.priceEnd }
            }
            const products = (await $api.post("/filter-products", {query, offset, sort})).data;
            return products;
        } catch (error) {
            throw error;
        }
    }

    async newProduct(product: IProduct) {
        try {
            await $api.post("/product", {product})
        }
        catch (error) {
            throw error;
        }
    }

    async getEmptyCells() {
        try {
            return (await $api.get("/empty-cells")).data;
        } catch (error) {
            throw error;
        }
    }

    async getPagesAmount() {
        try {
            return (await $api.get("/pages-amount")).data.pages;
        } catch (error) {
            throw error;
        }
    }

    async editProduct(productID: string, field: string, value: any) {
        try {
            return await $api.put(`/product/${productID}`, {field, value});
        } catch (error) {
            throw error;
        }
    }
}