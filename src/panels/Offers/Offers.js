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
  handleOfferClick,
  user,
  waiting,
  addLastDate,
  groupsOffers,
  doOffers,
  notificationEnter,
  adsEnter,
  firstLoad,
  clickedOffers,
}) => {
  const [screenWidth, setScreenWidth] = useState();
  const [curent, setCurent] = useState([]);
  const [curentCount, setCurentCount] = useState(false);
  const [sortedGroups, setSortedGroups] = useState([]);

  useEffect(() => {
    let copy = [...groups];

    // Функция сравнения для сортировки массива объектов
    function customSort(objA, objB) {
      const idA = objA.offerId;
      const idB = objB.offerId;

      if (
        clickedOffers.includes("" + idA) &&
        clickedOffers.includes("" + idB)
      ) {
        return (
          clickedOffers.indexOf("" + idA) - clickedOffers.indexOf("" + idB)
        );
      }

      if (clickedOffers.includes("" + idA)) {
        return 1;
      }

      if (clickedOffers.includes("" + idB)) {
        return -1;
      }
      return 0;
    }
    copy.sort(customSort);
    setSortedGroups(copy);
  }, []);

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
                            notificationEnter={notificationEnter}
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
                          notificationEnter={notificationEnter}
                          adsEnter={adsEnter}
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
          {sortedGroups.map((group, index) => {
            if (group.id) {
              if (
                (!group.offerInfo ||
                  waiting.length < 1 ||
                  group?.offerInfo?.finalDate) &&
                !group?.isDublicate
              ) {
                return (
                  <div
                    key={group.id}
                    onClick={() => {
                      handleOfferClick(group.offerId);
                      _tmr.push({
                        type: "reachGoal",
                        id: 3377560,
                        value: 2,
                        goal: "CompanyTransition",
                      });
                    }}
                  >
                    <OffersCard
                      handleOfferClick={handleOfferClick}
                      rngValue={rngValue}
                      group={group}
                      goToPage={goToPage}
                      user={user}
                      doOffers={doOffers}
                      notificationEnter={notificationEnter}
                      adsEnter={adsEnter}
                      firstLoad={firstLoad}
                    />
                  </div>
                );
              }
            } else {
              return (
                <form
                  className="withoutMember-form"
                  key={index}
                  onClick={() => {
                    handleOfferClick(group.offerId);
                    _tmr.push({
                      type: "reachGoal",
                      id: 3377560,
                      value: 2,
                      goal: "CompanyTransition",
                    });
                  }}
                >
                  <div className="card-withoutMember">
                    <div className="block__header">
                      <a
                        href={`${group.actionSrc}${"&vkid=" + user.id}${
                          notificationEnter
                            ? "&utm_medium=push"
                            : adsEnter
                            ? "&utm_medium=ads"
                            : ""
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
                    </div>
                    <a
                      className="block__btns"
                      href={`${group.actionSrc}&vkid=${user.id}${
                        notificationEnter
                          ? "&utm_medium=push"
                          : adsEnter
                          ? "&utm_medium=ads"
                          : ""
                      }`}
                      target="_blank"
                    >
                      <input
                        type="button"
                        value={
                          firstLoad
                            ? "Получить " + rngValue.toLocaleString("ru") + " ₽"
                            : "Получить деньги"
                        }
                        className="block__btns-getMoney"
                      />
                    </a>
                  </div>
                </form>
              );
            }
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
