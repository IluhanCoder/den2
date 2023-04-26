import IUser from './interfaces/IUser';
import IQuery from './interfaces/IQuery';
import IProduct from './interfaces/IProduct';
import productService from './services/product-service';
import ProductSortOptions from './static/product-sort-options';
import React, { useEffect, useState } from 'react';
import ProductsTable from './components/products-table';
import ProductForm from './components/product-form';
import SearchForm from './components/search-bar';
import PageToggler from './components/page-toggler';
import buttonStyle from './styles/button';
import { useNavigate } from 'react-router-dom';
const html2PDF = require("jspdf-html2canvas");

const MainPage = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState<IProduct[]>([]);
  const [sort, setSort] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [filterQuery, setFilterQuery] = useState<IQuery>({});

  const getProducts = async () => {
    setProducts(await productService.filterProducts(filterQuery, offset, ProductSortOptions[sort].value));
  }

  const showEmptyCellsHandler = async () => {
    setProducts(await productService.getEmptyCells())
  }

  const pdfHandler = async () => {
    try {
      const page = document.getElementById("tab");
      page!.style.backgroundColor = "white";
      html2PDF(page, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "./pdf/generate.pdf",
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    document.addEventListener("productFormSubmit", () => getProducts());
    document.addEventListener("onProductDelete", () => getProducts());
    document.addEventListener("onProductEdit", () => getProducts());
  }, [])

  useEffect(() => {
    getProducts();
  }, [sort, offset, filterQuery])

    return (
        <div className="App flex flex-col">
            <div className='flex justify-center'>
                <button className={buttonStyle} type='button' onClick={() => {localStorage.removeItem("user"); navigate("/") }}>вийти з облікового запису</button>
            </div>
            <div className='flex justify-between flex-col bg-gray-100 drop-shadow-lg rounded m-10 p-4'>
            <div className='flex justify-center text-2xl'>Додання продукту:</div>
            <ProductForm/>
            </div>
            <div className='flex justify-between flex-col bg-gray-100 drop-shadow-lg rounded m-10 p-4'>
            <div className='flex justify-center text-2xl'>Фільтрація:</div>
            <SearchForm setFilterQuery={setFilterQuery} setSort={setSort}/>
            </div>
            <div className='flex justify-center'><button type='button' onClick={showEmptyCellsHandler} className={buttonStyle}>вивести пусті записи</button></div>
            <ProductsTable products={products}/>
            <PageToggler currentPage={offset} setPage={setOffset}/>
            <div className='flex justify-center'><button onClick={pdfHandler} className={buttonStyle}>сформувати pdf-звіт</button></div>
        </div>
    )
}

export default MainPage;