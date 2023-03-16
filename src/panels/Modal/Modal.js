import React, { useState } from "react";
import { Calendar } from "@vkontakte/vkui";
import "./Modals.css";

function Modal({
  userName,
  date,
  offerId,
  addDate,
  logo,
  offerName,
  modalsCounter,
  // fetchPos,
}) {
  const [value, setValue] = useState();
  const [error, setError] = useState("");
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "UTC",
  };
  const approveDate = new Date(date);

  const chooseDate = async (e) => {
    const sixMonthsAgo = new Date(approveDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() + 6);

    const dateToCheck = new Date(e); // замените на дату, которую вы хотите проверить
    if (dateToCheck.getTime() <= sixMonthsAgo.getTime()) {
      setValue(e);
      setError("");
    } else {
      setError(
        `, не позднее чем ${sixMonthsAgo.toLocaleString("ru", options)}`
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal__wrap">
        <div className="modal__header">
          <div className="modal__header-logo">
            <img src={logo} className="modal__header-logo-img" />
            <div className="modal__header-title">{offerName}</div>
          </div>
          <div className="modal__header-date">
            <div className="header-date">
              {approveDate.toLocaleString("ru", options)}
            </div>
            <div className="header-date-getText">Дата получения займа</div>
          </div>
        </div>
        <div className="modal__main">
          <div className="modal__main-text">
            {userName + ", укажите дату возврата займа" + error}
          </div>
          <div className="modal__main-calendar">
            <Calendar
              value={value}
              onChange={chooseDate}
              disablePast={true}
              disablePickers={true}
            />
          </div>
          {value && (
            <div className="modal__main-currentDate">
              <div className="header-date">
                {value.toLocaleString("ru", options)}
              </div>
              <div className="header-date-getText">Дата возврата займа</div>
            </div>
          )}
          <div
            className={`modal__main-btn ${
              value && !modalsCounter && error.length < 1 && "activeBtn"
            }`}
            onClick={() => {
              error.length < 1 ? addDate(+date, +value, offerId) : "";
            }}
          >
            Продолжить
          </div>
        </div>
      </div>
    </div>
  );
}
export default Modal;
