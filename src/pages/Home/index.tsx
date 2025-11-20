import React from "react";
import styles from "./Home.module.scss";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  type FiltersType,
  selectFilterState,
  setFilterId,
  setSearchValue,
} from "../../redux/slisec/filterSlice";
import { fetchItems, selectItemsData } from "../../redux/slisec/itemsSlice";

import Cart from "../../components/Cart";
import type { Items } from "../../types/items";
import Skeleton from "../../components/Skeleton/index";
import Pagination from "../../components/Pagination";

const filters: FiltersType[] = [
  { name: "Все элементы", filterProperty: "all" },
  { name: "Понравившиеся", filterProperty: "liked" },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, likedItems, searchValue } = useAppSelector(selectFilterState);
  const { items, meta, status } = useSelector(selectItemsData);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  const [page, setPage] = React.useState<number>(1);
  const [limit] = React.useState<number>(6);

  React.useEffect(() => {
    if (filter.filterProperty === "liked") return;
    const handler = setTimeout(() => {
      dispatch(fetchItems({ page, limit }));
    }, 300);
    return () => clearTimeout(handler);
  }, [dispatch, page, limit, searchValue, filter.filterProperty]);

  React.useEffect(() => {
    setPage(1);
  }, [filter.filterProperty]);

  const itemsToRender: Items[] =
    filter.filterProperty === "liked" ? (likedItems ?? []) : (items ?? []);

  const filteredItems = itemsToRender
    .filter(Boolean)
    .filter((obj: Items) =>
      obj.title.toLowerCase().includes(searchValue.toLowerCase()),
    );

  React.useEffect(() => {
    if (filter.filterProperty !== "liked" && meta) {
      if (page > meta.total_pages && meta.total_pages > 0) {
        setPage(meta.total_pages);
      }
    }
  }, [meta, page, filter.filterProperty]);

  const onChangeCategory = (obj: FiltersType) => {
    dispatch(setFilterId(obj));
    dispatch(setSearchValue(""));
    setValue("");
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    dispatch(setSearchValue(event.target.value));
    setPage(1);
  };

  return (
    <div className={styles.content}>
      <div className={styles.content_top}>
        <div className={styles.content_top_filters}>
          <ul className={styles.content_top_list}>
            {filters.map((obj, idx) => (
              <li
                key={idx}
                onClick={() => onChangeCategory(obj)}
                className={
                  filter.filterProperty === obj.filterProperty
                    ? styles.active
                    : ""
                }
              >
                {obj.name}
              </li>
            ))}
          </ul>
        </div>
        <input
          className={styles.content_top_search}
          ref={inputRef}
          onChange={onChangeInput}
          value={value}
          placeholder="Найдите что вам интересно..."
        />
      </div>
      <div>
        {
          <div className={styles.content_items}>
            {status === "loading" ? (
              [...new Array(6)].map((_, index) => <Skeleton key={index} />)
            ) : filter.filterProperty === "liked" && likedItems.length === 0 ? (
              <h2 className={styles.content_items_empty}>
                Добавьте элементы в избранное, чтобы они появились здесь.
              </h2>
            ) : (
              filteredItems.map((obj) => <Cart key={obj.id} {...obj} />)
            )}
          </div>
        }
      </div>
      {filter.filterProperty !== "liked" && meta && meta.total_pages > 1 && (
        <Pagination
          current={meta.current_page}
          totalPages={meta.total_pages}
          onChange={(p: React.SetStateAction<number>) => setPage(p)}
        />
      )}
    </div>
  );
};

export default Home;
