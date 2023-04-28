import { useState } from "react";
import ProductSortOptions from "../static/product-sort-options";
import ProductStatuses from "../static/product-statuses";
import RangeSelector from "./search-bar-components/range-selector";
import IQuery from "../interfaces/IQuery";
import formStyle from "../styles/form";
import buttonStyle from "../styles/button";

interface LocalParams {
  setSort: React.Dispatch<React.SetStateAction<number>>;
  setFilterQuery: React.Dispatch<React.SetStateAction<object>>;
}

const SearchForm = ({ setSort, setFilterQuery }: LocalParams) => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [quantityStart, setQuantityStart] = useState<number | undefined>(
    undefined
  );
  const [quantityEnd, setQuantityEnd] = useState<number | undefined>(undefined);
  const [priceStart, setPriceStart] = useState<number | undefined>(undefined);
  const [priceEnd, setPriceEnd] = useState<number | undefined>(undefined);

  const filterHandler = () => {
    const query: IQuery = {
      _id: id,
      nameString: name,
      descString: desc,
      category,
      status,
      quantityStart,
      quantityEnd,
      priceStart,
      priceEnd,
    };

    setFilterQuery(query);
  };

  return (
    <div>
      <form className={formStyle}>
        <div>
          <label>id продукту:</label>
          <input
            type="text"
            value={id}
            onChange={(e: any) => setId(e.target.value)}
          />
        </div>
        <div>
          <label>Назва продукту:</label>
          <input
            type="text"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Опис продукту:</label>
          <input
            type="text"
            value={desc}
            onChange={(e: any) => setDesc(e.target.value)}
          />
        </div>
        <div>
          <label>Категорія:</label>
          <input
            type="text"
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Статус:</label>
          <select
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
          >
            <option value={""}>будь-який</option>
            {ProductStatuses.map((status: string) => {
              return (
                <option value={status} key={status}>
                  {status}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <RangeSelector
            label="Кількість"
            setFrom={setQuantityStart}
            setTo={setQuantityEnd}
            from={quantityStart}
            to={quantityEnd}
          />
        </div>
        <div>
          <RangeSelector
            label="Вартість"
            setFrom={setPriceStart}
            setTo={setPriceEnd}
            from={priceStart}
            to={priceEnd}
          />
        </div>
        <div>
          <label>Сортування:</label>
          <select onChange={(e: any) => setSort(e.target.value)}>
            {ProductSortOptions.map((op: any) => {
              return (
                <option key={op.value} value={ProductSortOptions.indexOf(op)}>
                  {op.label}
                </option>
              );
            })}
          </select>
        </div>
      </form>
      <div className="text-2xl flex justify-center">
        <button type="button" onClick={filterHandler} className={buttonStyle}>
          знайти
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
