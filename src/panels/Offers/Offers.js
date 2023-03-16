import React from "react";
import PropTypes from "prop-types";
import "./Offers.css";
import logo from "img/SmartMoneyLogo.png";
import Back from "img/chevron-back.svg";
import { useState, useEffect, useContext } from "react";
import delimeter from "img/delimeter.svg";
import OffersCard from "panels/Offers/components/OffersCard";
import Chance from "components/Chance";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper";
const Offers = ({
  goToPage,
  rngValue,
  groups,
  groupsWithout,
  user,
  waiting,
  addLastDate,
  groupsOffers,
  doOffers,
}) => {
  const [screenWidth, setScreenWidth] = useState();
  const [curent, setCurent] = useState([]);
  const [curentCount, setCurentCount] = useState(false);

  const differentChance = {
    high: ["Высокий"],
    middle: ["Средний"],
    low: ["Низкий"],
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setCurent(false);
    let count = 0;
    for (const item of groupsOffers) {
      if (!item?.offerInfo?.finalDate) {
        setCurent(true);
        count++;
      }
    }
    if (count == 1) {
      setCurentCount(true);
    }
  }, [groups, user]);

  return (
    <div className="offers">
      <div className="offers__header">
        <img
          src={Back}
          alt="Back"
          className="header-Back"
          onClick={() => window.history.back()}
          data-to="home"
        />
        <div className="OffersHeader__logo">
          <img src={logo} className="OffersHeader__logo-img" />
          <div className="OffersHeader__logo-text">Займы онлайн</div>
        </div>
      </div>
      <div className="offers__main">
        {curent && (
          <div className="offers__available">
            <div className="title">Текущие займы</div>
            <div className="blocks">
              {screenWidth < 560 ? (
                <Swiper
                  pagination={true}
                  modules={[Pagination]}
                  slidesPerView={1}
                  className="mySwiper"
                  spaceBetween={30}
                >
                  {groupsOffers.map((group, index) => {
                    if (!group?.offerInfo?.finalDate) {
                      return (
                        <SwiperSlide key={group.offerInfo.approvalDate}>
                          <OffersCard
                            rngValue={rngValue}
                            group={group}
                            goToPage={goToPage}
                            user={user}
                            addLastDate={addLastDate}
                            doOffers={doOffers}
                            curentCount={curentCount}
                          />
                        </SwiperSlide>
                      );
                    }
                  })}
                </Swiper>
              ) : (
                <div className="blocks-desktop">
                  {groupsOffers.map((group, index) => {
                    if (!group?.offerInfo?.finalDate) {
                      return (
                        <OffersCard
                          rngValue={rngValue}
                          group={group}
                          goToPage={goToPage}
                          user={user}
                          key={group?.offerInfo?.approvalDate}
                          addLastDate={addLastDate}
                          doOffers={doOffers}
                          curentCount={curentCount}
                        />
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="title">Доступные предложения</div>
        <div className="blocks">
          {groups
            .map((group, index) => {
              if (
                (!group.offerInfo ||
                  waiting.length < 1 ||
                  group?.offerInfo?.finalDate) &&
                !group?.isDublicate
              ) {
                return (
                  <OffersCard
                    rngValue={rngValue}
                    group={group}
                    goToPage={goToPage}
                    key={group.id}
                    user={user}
                    doOffers={doOffers}
                  />
                );
              }
            })
            .sort((a, b) =>
              a.props.group.averageRating < b.props.group.averageRating ? 1 : -1
            )}
        </div>

        <div className="delimeter">
          <div className="delimeter-row"></div>
          <img className="delimeter-img" src={delimeter} />
          <div className="delimeter-row"></div>
        </div>
        <div className="delimeter__title">
          Дальше организации без представителей
        </div>
        <div className="delimeter__text">
          Такие организации не отвечают на отзывы пользователей
        </div>

        <div className="blocks">
          {groupsWithout.map((group, index) => {
            return (
              <form className="withoutMember-form" key={index}>
                <div className="card-withoutMember">
                  <div className="block__header">
                    <a
                      href={`${group.actionSrc}${
                        group.offerId == 282 || group.offerId == 283
                          ? ""
                          : "&vkid=" + user.id
                      }`}
                      target="_blank"
                      className="block__header-link"
                    >
                      <div className="block__logo">
                        <img
                          src={group.imgSrc}
                          alt="logo"
                          className="block__logo-img"
                        />
                        <div className="block__name">{group.name}</div>
                      </div>
                    </a>

                    {/* <div className="block__chance">
                      <div className="block__chance-total">
                        <span>{differentChance[group.chance]}</span>
                        <div className="block__chance-title">
                          Шанс одобрения
                        </div>
                      </div>
                      <Chance state={group?.chance} />
                    </div> */}
                  </div>
                  <a
                    className="block__btns"
                    href={`${group.actionSrc}&vkid=${user.id}`}
                    target="_blank"
                  >
                    <input
                      type="button"
                      value={"Получить " + rngValue.toLocaleString("ru") + " ₽"}
                      className="block__btns-getMoney"
                    />
                  </a>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Offers.propTypes = {
  id: PropTypes.string.isRequired,
  goToPage: PropTypes.func.isRequired,
};

export default Offers;
