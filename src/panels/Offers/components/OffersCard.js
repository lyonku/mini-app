import ActiveStarSmall from "components/ActiveStarSmall";
import smailik from "img/smailik.png";
import laik from "img/laik.png";
import complete from "img/complete.png";
import Chance from "components/Chance";
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

function OffersCard({
  rngValue,
  goToPage,
  group,
  user,
  addLastDate,
  doOffers,
  curentCount,
  notificationEnter,
  adsEnter,
  firstLoad,
}) {
  const [doReview, setDoReview] = useState(false);
  const [colorDate, setColorDate] = useState("");
  const [reviewAccess, setReviewAccess] = useState("");

  useEffect(() => {
    if (group?.offerInfo && !group?.offerInfo?.finalDate) {
      setDoReview(true);
    }
  }, [user]);

  const fillColorArray = [
    "#FF6B77",
    "#FF6B77",
    "#FFA735",
    "#37C99E",
    "#37C99E",
  ];

  const differentChance = {
    high: ["Высокий"],
    middle: ["Средний"],
    low: ["Низкий"],
  };
  const plural = require("plural-ru");
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "UTC",
  };

  const dateEnd = new Date(+group?.offerInfo?.selectedDate);
  const dateStart = new Date(+group?.offerInfo?.approvalDate);
  const dateNow = new Date();

  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTimeToday = dateEnd.getTime() - dateNow.getTime();
  const diffInDays = Math.round(diffInTimeToday / oneDay);

  const diffInTimeAll = dateEnd.getTime() - dateStart.getTime();
  const diffInTime = dateNow.getTime() - dateStart.getTime();

  const datePercent =
    (Math.round(diffInTime / oneDay) / Math.round(diffInTimeAll / oneDay)) *
    100;

  useEffect(() => {
    if (diffInDays >= 7) {
      setColorDate("#11C564");
    }
    if (diffInDays >= 3 && diffInDays < 7) {
      setColorDate("#FFB341");
    }
    if (diffInDays >= 0 && diffInDays < 3) {
      setColorDate("#F81A1A");
    }
  }, []);

  useEffect(() => {
    const items = [];
    if (user.submited?.conversions) {
      for (const item of user?.submited?.conversionsWrittenIds) {
        items.push(+item.approvalDate);
      }
      if (items.includes(+group?.offerInfo?.approvalDate)) {
        setReviewAccess(true);
      }
    }
  }, [user, group]);

  useEffect(() => {
    if (group?.offerInfo && !group.averageRating && user.submited) {
      doOffers(user.submited.conversions);
    }
  }, [user]);

  return (
    <div
      className={`card ${doReview && "currentZaim"} ${
        curentCount && "currentZaimOne"
      }`}
    >
      <div className={`block__header ${doReview && "new"}`}>
        <a
          href={`${group.actionSrc}${
            group.offerId == 282 || group.offerId == 283
              ? ""
              : "&vkid=" + user.id
          }${
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
            <img src={group.imgSrc} alt="Back" className="block__logo-img" />
            <div className="block__name">{group.name}</div>
          </div>
        </a>
        {!doReview ? (
          <div className="block__chance">
            {/* <div className="block__chance-total">
              <span>{differentChance[group.chance]}</span>
              <div className="block__chance-title">Шанс одобрения</div>
            </div>
            <Chance state={group.chance} /> */}
          </div>
        ) : (
          <div className="block__date">
            <div className="block__date-title">
              {dateEnd.toLocaleString("ru", options)}
            </div>
            <div className="block__date-text">дата возврата займа</div>
          </div>
        )}
      </div>
      <form className="block__btns">
        {doReview ? (
          <div className="block__btns-current">
            <div className="block__btns-current-left">
              <div className="current-left-title">
                {diffInDays < 0 ? "просрочено: " : "осталось: "}
                <span>
                  {Math.abs(diffInDays) +
                    " " +
                    plural(Math.abs(diffInDays), "день", "дня", "дней")}
                </span>
              </div>

              <div className="current-left-bar">
                {diffInDays < 0 ? (
                  ""
                ) : (
                  <ProgressBar
                    completed={100 - Math.round(datePercent)}
                    bgColor={colorDate}
                    isLabelVisible={false}
                    baseBgColor="#EBEBEB"
                    labelColor="#924646"
                    height="10px"
                  />
                )}
              </div>
            </div>
            <div className="block__btns-btn-wrap">
              <div
                className="block__btns-btn"
                onClick={() => {
                  addLastDate(+group?.offerInfo?.approvalDate);
                }}
              >
                <img src={complete} className="block__btns-btn-img"></img>
                {"Заем погашен"}
              </div>
            </div>

            <div className="block__btns-leaveFeedback">
              <div className="leaveFeedback__body">
                <img
                  className="leaveFeedback__body-img"
                  src={reviewAccess ? laik : smailik}
                />
                <div className="leaveFeedback__body-text">
                  <div className="leaveFeedback__body-title">
                    {reviewAccess
                      ? "Спасибо, что оставили отзыв"
                      : "Возникли сложности?"}
                  </div>
                  <div className="leaveFeedback__body-subtext">
                    {reviewAccess
                      ? "Посмотрите ответы представителей компании"
                      : "Оставьте отзыв и получите ответ от представителя компании"}
                  </div>
                </div>
              </div>
              <div
                className="leaveFeedback-btn"
                onClick={() => goToPage("comments", group)}
                style={{
                  color:
                    fillColorArray[
                      Math.floor(
                        Number(group.averageRating ? group.averageRating : 5)
                      ) - 1
                    ],
                }}
              >
                {
                  <ActiveStarSmall
                    color={Math.floor(
                      Number(group.averageRating ? group.averageRating : 3)
                    )}
                    height={14}
                    style={{ marginTop: -2 }}
                    id={group.id}
                  />
                }
                {group.averageRating && group.averageRating != NaN
                  ? group.averageRating
                  : ""}

                <span>
                  {reviewAccess
                    ? group.reviewsCount +
                      " " +
                      plural(group.reviewsCount, "отзыв", "отзывa", "отзывов")
                    : "Оставить отзыв"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <a
              href={`${group.actionSrc}${
                group.offerId == 282 || group.offerId == 283
                  ? ""
                  : "&vkid=" + user.id
              }${
                notificationEnter
                  ? "&utm_medium=push"
                  : adsEnter
                  ? "&utm_medium=ads"
                  : ""
              }`}
              target="_blank"
              className="block_btns-link"
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
            <div
              className="block__btns-reviews"
              id={group.id}
              onClick={() => goToPage("comments", group)}
              data-to="comments"
              style={{
                color:
                  fillColorArray[
                    Math.floor(
                      Number(group.averageRating ? group.averageRating : 5)
                    ) - 1
                  ],
              }}
            >
              {
                <ActiveStarSmall
                  color={Math.floor(
                    Number(group.averageRating ? group.averageRating : 3)
                  )}
                  height={14}
                  style={{ marginTop: -2 }}
                  id={group.id}
                />
              }
              {group.averageRating ? group.averageRating : ""}
              <div className="block__btns-reviews-count" id={group.id}>
                {group.reviewsCount
                  ? group.reviewsCount +
                    " " +
                    plural(group.reviewsCount, "отзыв", "отзывa", "отзывов")
                  : "0 отзывов"}
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
export default OffersCard;
