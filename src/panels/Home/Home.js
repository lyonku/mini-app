import React, { useCallback } from "react";
import PropTypes from "prop-types";

import "./Home.css";
import logo from "img/SmartMoneyLogo.png";
import info from "img/SmartMoneyInfo.png";

const Home = ({ goToPage, onChange, rngValue, load }) => {
  const getBackgroundSize = () => {
    return { backgroundSize: `${((rngValue - 5000) / 25000) * 100}% 100%` };
  };

  const handleSumChange = (event) => {
    if (event.target.value >= 5000 && event.target.value <= 30000) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="main">
      <div className="header">
        <div className="header__logo">
          <img src={logo} className="header__logo-img" />
          <div className="header__logo-text">Займы онлайн</div>
        </div>
        <div className="header__content">Бесплатный подбор займов</div>
      </div>

      <div className="block-form">
        <div className="block-form__title">Сумма займа</div>
        <div className="block-form__price">
          <span className="block-form__price-text">
            {rngValue.toLocaleString("ru") + " ₽"}
          </span>
        </div>
        <div className="block-form__slidecontainer">
          <input
            type="range"
            min="5000"
            max="30000"
            step="1000"
            className="slider"
            value={rngValue}
            onChange={handleSumChange}
            style={getBackgroundSize()}
          />
        </div>
        <div className="block-form__price-range">
          <span className="price__range-item">от 5 000 ₽</span>
          <span className="price__range-item">до 30 000 ₽</span>
        </div>

        <div className="block-form__btnform">
          <div
            className="block-form__button"
            onClick={() => goToPage("offers")}
          >
            {load ? <span className="loaderBtn"></span> : "Подобрать займ"}
          </div>
        </div>
      </div>

      <div className="block__second">
        <div className="block__info">
          <img src={info} className="block__info-img" />
          <div className="block__info-text">
            Займы онлайн позволяют получить займ и оценить качество работы
            МФО и МКК
          </div>
        </div>
        <div
          onClick={() => goToPage("membership")}
          className="block-membership"
        >
          Я – представитель МФО/МКК
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Home;
