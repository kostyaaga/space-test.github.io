import React from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import style from "./ItemsDetails.module.scss";
import type { Items } from "../../types/items";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectIsLiked, toggleLike } from "../../redux/slisec/filterSlice";

import iconActiveHeart from "../../assets/img/active-heart.svg";
import iconHeart from "../../assets/img/heart.svg";
import iconDelete from "../../assets/img/delete.svg";
import iconArrow from "../../assets/img/arrow-back.svg";

const ItemsDetails: React.FC = () => {
  const [item, setItem] = React.useState<Items>();
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const isLiked = useAppSelector(selectIsLiked(numericId));
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    async function fetchItem() {
      try {
        const { data } = await axios.get(
          "https://7d247ed412521517.mokky.dev/items/" + id,
        );
        setItem(data);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    }
    fetchItem();
  }, []);

  if (!item)
    return (
      <>
        <h1>Загрузка</h1>
      </>
    );

  const onChangeLiked = () => {
    if (!id) return;
    dispatch(
      toggleLike({
        id: Number(id),
        imageUrl: item.imageUrl,
        title: item.title,
        description: item.description,
      }),
    );
  };

  return (
    <div className={style.content}>
      <img src={item.imageUrl} alt="" />
      <div className={style.content_info}>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <div className={style.content_info_btn}>
          <button
            onClick={onChangeLiked}
            className={style.content_info_btn_heart}
          >
            {isLiked ? (
              <>
                <p>Запись в избранном</p>
                <img src={iconActiveHeart} alt="" />
              </>
            ) : (
              <>
                <p>Добавить в избранное</p>
                <img src={iconHeart} alt="" />
              </>
            )}
          </button>
          <button className={style.content_info_btn_delete}>
            <p>Удалить запись</p>
            <img src={iconDelete} alt="" />
          </button>
        </div>
        <Link className={style.content_info_link} to={`/`}>
          <img src={iconArrow} className={style.arrow_img} alt="arrow-back" />
          <p>Вернуться назад</p>
        </Link>
      </div>
    </div>
  );
};

export default ItemsDetails;
