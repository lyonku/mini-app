import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import "./Comments.css";
import firstReview from "img/firstReview.svg";
import Back from "img/chevron-back.svg";
import "animate.css";
import { Alert, SplitLayout } from "@vkontakte/vkui";

import CommentsItem from "panels/Comments/components/CommentsItem";
import CommentsHeader from "./components/CommentsHeader";

import { Context } from "../..";
import CommentsForm from "./components/CommentsForm";

const Comments = ({
  currentGroup,
  user,
  groups,
  chosenGroup,
  setUpdateReviews,
  popout,
  setPopout,
  history,
  updateReviews,
}) => {
  const [review, addReview] = useState("");
  const [rating, setRating] = useState(0);
  const [textReply, setTextReply] = useState();
  const [editText, setEditText] = useState();
  const [allComments, setAllComments] = useState(true);
  const [currentGroupRate, setCurrentGroupRate] = useState({});
  const [messagesReply, setMessagesReply] = useState(true);
  const [animate, setAnimate] = useState({});
  const [commentPermit, setCommentPermit] = useState([]);
  const [latestDoc, setLatestDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesIdMass, setMessagesIdMass] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [firstFetching, setFirstFetching] = useState(false);
  const commentsMainRef = useRef(null);
  const commentsHeaderRef = useRef(null);

  const { firestore } = useContext(Context);
  let count = 0;

  const getNextReviews = async () => {
    if (fetching && currentGroup?.id) {
      let copy = Object.assign([], messages);
      let copy2 = Object.assign([], messagesIdMass);
      const ref = latestDoc
        ? firestore
            .collection(currentGroup?.id + "_" + currentGroup?.name)
            .orderBy("createdAt", "desc")
            .startAfter(latestDoc)
            .limit(10)
        : firestore
            .collection(currentGroup?.id + "_" + currentGroup?.name)
            .orderBy("createdAt", "desc")
            .limit(10);
      ref.get().then((querySnapshot) => {
        if (updateReviews) {
          copy = [];
        }
        querySnapshot.forEach((doc) => {
          copy2.push(doc.id);
          const review = doc.data();
          copy.push(review);
        });
        setMessages(copy);
        setMessagesIdMass(copy2);
        setLatestDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        if (!querySnapshot.empty) {
          setFetching(false);
        } else {
          setFirstFetching(true);
        }
        setUpdateReviews(false);
      });
    }
  };

  useEffect(async () => {
    getNextReviews();
  }, [groups, currentGroup]);

  const scrollHandler = (e) => {
    if (
      e.target.scrollHeight - (e.target.scrollTop + window.innerHeight - 150) <
        150 &&
      messages?.length < currentGroupRate?.reviewsCount
    ) {
      count++;
      if (count == 1) {
        getNextReviews();
        setFetching(true);
      }
    }
  };

  useEffect(() => {
    if (user?.submited?.convertedIds?.length >= 1 && currentGroup) {
      let copy = Object.assign([], commentPermit);
      let idsConverted = [];
      let idsWritten = [];
      user.submited?.convertedIds?.forEach((item) => {
        if (currentGroup.offerId == item) {
          idsConverted.push(item);
        }
      });
      user.submited?.reviewsWrittenIds?.forEach((item) => {
        if (currentGroup.offerId == item) {
          idsWritten.push(item);
        }
      });
      if (idsConverted.length > idsWritten.length) {
        copy = idsConverted.slice(0, idsConverted.length - idsWritten.length);
        setCommentPermit(copy);
      }
    }
  }, [user, currentGroup]);

  const openAction = () => {
    history.push("modal");
    window.history.pushState({ panel: "modal" }, "modal");
    setPopout(
      <Alert
        actions={[
          {
            title: "Хорошо",
            autoClose: true,
            mode: "cancel",
            action: () => {
              setPopout(null);
              history.pop();
            },
          },
        ]}
        actionsLayout="vertical"
        onClose={() => {
          setPopout(null);
          history.pop();
        }}
        text={
          "Отзыв можно оставить после того, как вам одобрили займ через мини-приложение " +
          " «Займы онлайн».  Это позволяет избежать накруток и показывать только достоверные отзывы."
        }
        className="modal"
      />
    );
  };

  useEffect(() => {
    if (review === "inactive" || review === "") return;

    const handleClick = (e) => {
      if (
        commentsMainRef?.current?.contains(e.target) ||
        commentsHeaderRef?.current?.contains(e.target)
      ) {
        handleBlockComment();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [review]);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < messages?.length; i++) {
      if (messages[i]?.reply) {
        count += 1;
      }
    }
    if (count == messages?.length) {
      setMessagesReply(true);
    } else {
      setMessagesReply(false);
    }
  }, [messages]);

  useEffect(() => {
    const handleCommentCount = () => {
      for (let i = 0; i < groups?.length; i++) {
        if (groups[i]?.id == currentGroup?.id) {
          setCurrentGroupRate({
            averageRating: groups[i].averageRating,
            reviewsCount: groups[i].reviewsCount,
          });
        }
      }
    };
    handleCommentCount();
  }, [groups, currentGroup]);

  const addComment = async (text) => {
    let check = false;

    for (const item of text) {
      if (item != " ") {
        check = true;
      }
    }
    if (rating && text && check) {
      let param = window.location.href;
      let totalParam = param.slice(param.indexOf("vk_access"));
      addReview(review === "active" ? "inactive" : "active");

      const response = await fetch(
        `https://us-central1-loans-vk-app.cloudfunctions.net/add-review?rating=${rating}&text=${text}&offerId=${currentGroup.offerId}&approvalDate=${currentGroup.offerInfo.approvalDate}&${totalParam}`,
        {
          method: "GET",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() => {
        setLatestDoc(null);
        setUpdateReviews(true);
        setFetching(true);
      });

      let copyPermit = commentPermit;
      copyPermit.shift();
      setCommentPermit(copyPermit);
    } else {
      setAnimate({
        textarea: !text || !check ? true : false,
        rate: !rating ? true : false,
      });
    }

    setTimeout(() => setAnimate({ ...animate, rating: false }), 1000);
  };

  const addReply = async (text) => {
    let param = window.location.href;
    let totalParam = param.slice(param.indexOf("vk_access"));
    addReview(review === "active" ? "inactive" : "active");

    let check = false;

    for (const item of text) {
      if (item != " ") {
        check = true;
      }
    }

    if (check || text.length == 0) {
      const response = await fetch(
        `https://us-central1-loans-vk-app.cloudfunctions.net/add-reply?reply=${text}&comment_id=${textReply}&group_id=${currentGroup.id}&${totalParam}`,
        {
          method: "GET",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() => {
        setLatestDoc(null);
        setUpdateReviews(true);
        setFetching(true);
      });
    }
  };

  const handleBlockComment = () => {
    addReview(review === "active" ? "inactive" : "active");
    setEditText("");
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  if ((messages.length < 1 && !firstFetching) || !currentGroup) {
    return (
      <div className="loader-wrap">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="comments">
      <CommentsHeader
        Back={Back}
        popout={popout}
        history={history}
        setPopout={setPopout}
        currentGroup={currentGroup}
        currentGroupRate={currentGroupRate}
        commentsHeaderRef={commentsHeaderRef}
        messages={messages}
      />
      <div className="wrap"></div>
      <div
        className={`comments__main ${
          chosenGroup?.id == currentGroup?.id && "chosenGroup"
        } ${commentPermit.length < 1 && "permitDenied"} ${
          review == "active" ? "back" : ""
        }`}
        ref={commentsMainRef}
        onScroll={scrollHandler}
      >
        {chosenGroup?.id == currentGroup?.id && (
          <div className="comments__change">
            <div
              className={`comments__change-item ${allComments && "current"}`}
              onClick={() => {
                setAllComments(true);
              }}
            >
              Все
            </div>
            <div
              className={`comments__change-item-noReply ${
                !allComments && "current"
              }`}
              onClick={() => {
                setAllComments(false);
              }}
            >
              Неотвеченные
            </div>
          </div>
        )}

        {messages.length >= 1 ? (
          messages.map(
            (comment, index) =>
              (!allComments ? !comment.reply : allComments) && (
                <CommentsItem
                  index={index}
                  comment={comment}
                  group={currentGroup}
                  setTextReply={setTextReply}
                  handleBlockComment={handleBlockComment}
                  messagesIdMass={messagesIdMass}
                  chosenGroup={chosenGroup}
                  setEditText={setEditText}
                  key={index}
                />
              )
          )
        ) : chosenGroup?.id == currentGroup?.id ? (
          ""
        ) : (
          <div className="comments__firstReview">
            <img
              className="comments__firstReview-img"
              src={firstReview}
              onError={() => {
                console.log("err");
              }}
            />

            <div className="comments__firstReview-title">
              Ваш отзыв может стать первым
            </div>

            <div className="comments__firstReview-text">
              Об этой организации ещё никто не писал, и вы можете это изменить
            </div>
            <SplitLayout
              popout={popout}
              className="comments__firstReview-btn-wrap"
            >
              <input
                type="button"
                value="Оставить отзыв"
                className="comments__firstReview-btn"
                onClick={
                  !commentPermit.length >= 1 ? openAction : handleBlockComment
                }
              />
            </SplitLayout>
          </div>
        )}
        {messagesReply && !allComments && (
          <div className="comments__firstReview">
            <img className="comments__firstReview-img" />
            <div className="comments__firstReview-title">
              Неотвеченных отзывов нет
            </div>
            <div className="comments__firstReview-text">
              Вы ответили на все доступные отзывы, так держать!
            </div>
          </div>
        )}
      </div>
      {messages.length >= 1 && chosenGroup?.id != currentGroup?.id && (
        <div className="comments__footer">
          <SplitLayout
            popout={popout}
            className="comments__firstReview-btn-wrap"
          >
            <input
              type="button"
              value="Оставить отзыв"
              className="comments__footer-btn"
              onClick={
                !commentPermit.length >= 1 ? openAction : handleBlockComment
              }
            />{" "}
          </SplitLayout>
        </div>
      )}
      <CommentsForm
        chosenGroup={chosenGroup}
        review={review}
        currentGroup={currentGroup}
        addComment={addComment}
        addReply={addReply}
        handleRating={handleRating}
        rating={rating}
        setEditText={setEditText}
        editText={editText}
        handleBlockComment={handleBlockComment}
        animate={animate}
        setAnimate={setAnimate}
        // fetchPos={fetchPos}
      />
    </div>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Comments;
