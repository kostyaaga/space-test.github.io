import React from "react";
import styles from "./Home.module.scss";

import { useAppDispatch, useAppSelector } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import {
  type FiltersType,
  selectFilterState,
  setFilterId,
  setSearchValue,
} from "../../redux/slisec/filterSlice.ts";
import { fetchItems, selectItemsData } from "../../redux/slisec/itemsSlice.ts";

import Cart from "../../components/Cart";
import type { Items } from "../../types/items.ts";

const filters: FiltersType[] = [
  { name: "Все элементы", filterProperty: "all" },
  { name: "Понравившиеся", filterProperty: "liked" },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, likedItems, searchValue } = useAppSelector(selectFilterState);
  const { items } = useSelector(selectItemsData);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  const itemsToRender =
    filter.filterProperty === "liked" ? (likedItems ?? []) : (items ?? []);

  const onChangeCategory = (obj: FiltersType) => {
    dispatch(setFilterId(obj));
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    dispatch(setSearchValue(event.target.value));
  };

  React.useEffect(() => {
    dispatch(fetchItems());
  }, []);

  const filteredItems = itemsToRender
    .filter(Boolean)
    .filter((obj: Items) =>
      obj.title.toLowerCase().includes(searchValue.toLowerCase()),
    );

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
        {filteredItems.length === 0 ? (
          <div className={styles.content_items_empty}>
            <h1>Тут нечего нет</h1>
            <img
              src="https://www.nasa.gov/wp-content/uploads/2023/03/a15pan11845-7.jpg?resize=900,427"
              alt=""
            />
          </div>
        ) : (
          <div className={styles.content_items}>
            {filteredItems.map((obj) => (
              <Cart key={obj.id} {...obj} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
