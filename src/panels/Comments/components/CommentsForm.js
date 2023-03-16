import React, { useState } from "react";

import InactiveStar from "components/InactiveStar";
import ActiveStar from "components/ActiveStar";
import { Rating } from "react-simple-star-rating";

function CommentsForm({
  chosenGroup,
  review,
  currentGroup,
  addComment,
  addReply,
  handleRating,
  rating,
  setEditText,
  editText,
  handleBlockComment,
  animate,
  setAnimate,
  // fetchPos,
}) {
  const [hover, setHover] = useState();

  const onPointerMove = (value) => {
    setHover(value);
  };

  const onPointerLeave = () => {
    setHover(rating);
  };

  return (
    <div className={`comments__feedback ${review}`}>
      {chosenGroup?.id != currentGroup?.id && (
        <>
          <div className="feedback-title">
            Ваша оценка и комментарий <br /> о компании {currentGroup?.name}
          </div>
          <div className="feedback-text">
            Опишите свой опыт работы с компанией {currentGroup?.name}.
            Информация о вашем займе подгрузится представителю компании
            автоматически. <b>Не указывайте</b> свои персональные данные в
            тексте отзыва, т.к. текст отзыва виден всем пользователям
          </div>
          <div className="feedback-rating">
            <Rating
              onClick={handleRating}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              transition
              className={
                animate.rate
                  ? "feedback-rating-item animate__animated animate__shakeX"
                  : "feedback-rating-item"
              }
              emptyIcon={<InactiveStar />}
              fillIcon={<ActiveStar rating={rating} hover={hover} />}
            />
          </div>
        </>
      )}
      <div className="feedback-textarea">
        <textarea
          className={
            animate.textarea
              ? "feedback-textarea-input animate__animated animate__shakeX"
              : "feedback-textarea-input"
          }
          value={editText}
          onChange={(e) => {
            setEditText(e.target.value);
            let str = editText;
            for (let i = 0; i < e.target.value.length; i++) {
              let num = e.target.value.charCodeAt(i);
              if (
                (num >= 32 && num <= 126) ||
                (num >= 1040 && num <= 1103) ||
                num == 1105 ||
                num == 1025
              ) {
              } else {
                setEditText(str.slice(0, i));
              }
            }
            // if (e.target.value.length >= 250) {
            //   setAnimate({
            //     textarea: e.target.value.length >= 250 ? true : false,
            //   });
            //   setTimeout(() => {
            //     setEditText(e.target.value.slice(0, 249));
            //   }, 1);
            //   setTimeout(() => setAnimate({ textarea: false }), 1000);
            // }
          }}
          maxLength="250"
        ></textarea>
      </div>
      <div
        className="feedback-submit-btn"
        onClick={() => {
          chosenGroup?.id != currentGroup?.id
            ? addComment(editText)
            : addReply(editText);
        }}
      >
        Отправить
      </div>
      <div className="feedback-cancel">
        <input
          type="button"
          value="Отменить"
          className="feedback-cancel-btn"
          onClick={handleBlockComment}
        />
      </div>
    </div>
  );
}
export default CommentsForm;
