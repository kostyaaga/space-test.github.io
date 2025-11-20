import React from "react";
import styles from "../../components/Header/Header.module.scss";

import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.svg";
import iconPlus from "../../assets/img/plus.svg";

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Link to="/">
        <div className={styles.header_logo}>
          <img src={logo} alt="" />
          <h1>Все про космос</h1>
        </div>
      </Link>
      <Link to="/create_item">
        <div className={styles.rightLink}>
          <img src={iconPlus} alt="" />
          <h3>Создать свою карточку</h3>
        </div>
      </Link>
    </div>
  );
};

export default Header;
