import { useEffect } from "react";
import usePagesAmount from "./hooks/usePagesAmount";
import buttonStyle from "../styles/button";

interface LocalParams {
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PageToggler = ({ currentPage, setPage }: LocalParams) => {
  const pagesAmount: number = usePagesAmount();

  const nextPageHandler = () => {
    setPage(currentPage + 1);
  };

  const previousPageHandler = () => {
    setPage(currentPage - 1);
  };

  if (pagesAmount > 1)
    return (
      <div>
        <div>
          {currentPage > 0 && (
            <button
              type="button"
              onClick={previousPageHandler}
              className={buttonStyle}
            >
              назад
            </button>
          )}
          {currentPage + 1 < pagesAmount && (
            <button
              type="button"
              onClick={nextPageHandler}
              className={buttonStyle}
            >
              вперед
            </button>
          )}
        </div>
        <div>{`${currentPage + 1}/${pagesAmount}`}</div>
      </div>
    );
  else return <></>;
};

export default PageToggler;
