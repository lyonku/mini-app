import React, { useState, useEffect, useContext } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
  Alert,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";
import Offers from "./panels/Offers";
import Comments from "./panels/Comments";
import Membership from "./panels/Membership";
import wifiLost from "img/wifiLost.png";

import { Context } from ".";
import Modal from "./panels/Modal";

const App = () => {
  const [rngValue, setRngValue] = useState([10000]);
  const [user, setUser] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [activeOrganization, setActiveOrganization] = useState();

  const [activePanel, setActivePanel] = useState("home"); // Ставим начальную панель
  const [history, setHistory] = useState(["home"]); // Заносим начальную панель в массив историй.
  const [waiting, setWaiting] = useState([]);
  const [adminInfo, setAdminInfo] = useState({ userRights: false });
  const [load, setLoad] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsOffers, setGroupsOffers] = useState([]);
  const [groupsFull, setGroupsFull] = useState([]);
  const [groupsWithout, setGroupsWithout] = useState([]);
  // const [groupsReviews, setGroupsReviews] = useState([]);
  const [updateReviews, setUpdateReviews] = useState();
  const { firestore, remoteConfig } = useContext(Context);
  const [popout, setPopout] = useState(null);
  const [modalsCounter, setModalsCounter] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [trigger2, setTrigger2] = useState(false);
  const [trigger3, setTrigger3] = useState(false);
  const [popout2, setPopout2] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [firstLoad, setFirstLoad] = useState(true);
  const [clickedOffers, setClickedOffers] = useState([]);

  const [retry, setRetry] = useState({});
  const [offersLoad, setOffersLoad] = useState(false);

  const [notificationEnter, setNotificationEnter] = useState(false);
  const [adsEnter, setAdsEnter] = useState(false);

  useEffect(async () => {
    let rcDefaults = require("./remote_config_defaults.json");
    remoteConfig.defaultConfig = rcDefaults;

    remoteConfig
      .fetchAndActivate()
      .then(() => {
        const val = remoteConfig.getValue("members");
        let json = JSON.parse(val._value);
        setGroupsFull(json);
        setGroups(json);
        // setGroupsWithout(json.withoutMember);
      })
      .catch((err) => {
        let json1 = JSON.parse(remoteConfig.defaultConfig.members);
        setGroupsFull(json1);
        setGroups(json1);
        // setGroupsWithout(json1.withoutMember);
      });
  }, []);

  useEffect(async () => {
    const response = await fetch(
      `https://europe-central2-loans-vk-app.cloudfunctions.net/init-groupInfo`
    );
    if (response.ok && groups.length > 1) {
      let json = await response.json();
      let copy = Object.assign([], groupsFull);
      for (const item of copy) {
        if (item.id) {
          if (json[item.id + "_" + item.name][0] == "NaN") {
            item.averageRating = "";
          } else {
            item.averageRating = json[item.id + "_" + item.name][0];
          }
          item.reviewsCount = json[item.id + "_" + item.name][1];
        }
      }
      setGroupsFull(copy);
      0;
    }
  }, [groups, updateReviews, user]);

  // Price change function
  const handleSumChange = (rngValue) => {
    setRngValue(+rngValue);
  };

  function doOffers(conversions) {
    let copy = Object.assign([], groupsFull);
    let groupsOffers = [];
    for (const item of conversions) {
      for (const group of copy) {
        if (group.offerId == +item.offerId) {
          let newState = Object.assign({}, group);
          newState.offerInfo = item;
          group.offerInfo = item;
          groupsOffers.push(newState);
        }
      }
    }
    setOffersLoad(true);
    setGroupsOffers(groupsOffers);
    setGroupsFull(copy);
  }

  // User initialization
  useEffect(() => {
    if (groups.length > 1) {
      async function fetchUser() {
        const user = await bridge.send("VKWebAppGetUserInfo").then((data) => {
          if (data.id) {
            firestore
              .collection("users")
              .doc(data.id + "")
              .get()
              .then((doc) => {
                data.submited = {};
                if (doc.exists) {
                  data.submited.conversions = [];
                  data.submited.convertedIds = [];
                  data.submited.reviewsWrittenIds = [];
                  data.nextAllowNotifications = 0;
                  data.submited.conversionsWrittenIds = [];

                  // if (doc.data().firstLoad == false) {
                  //   goToPage("offers");
                  //   setFirstLoad(false);
                  // }

                  if (doc.data().clickedOffers) {
                    setClickedOffers(doc.data().clickedOffers);
                  }

                  if (doc.data().nextAllowNotifications) {
                    data.nextAllowNotifications =
                      +doc.data().nextAllowNotifications;
                  }

                  if (doc.data().nextAllowNotifications == 0) {
                    getNotifications(0);
                  }

                  if (doc.data().conversions) {
                    for (const item of doc.data().conversions) {
                      let totalItem = JSON.parse(item);
                      if (!item.finalDate) {
                        data.submited.convertedIds.push(totalItem.offerId);
                      }
                      data.submited.conversions.push(totalItem);
                    }
                    for (const item of doc.data().reviewsWrittenIds) {
                      let totalItem = JSON.parse(item);
                      data.submited.reviewsWrittenIds.push(totalItem.offerId);
                      data.submited.conversionsWrittenIds.push(totalItem);
                    }

                    trigger2
                      ? setTrigger2(false)
                      : doOffers(data.submited.conversions);
                  }
                } else {
                  setOffersLoad(true);
                  getNotifications(0);
                }
              });

            setUser(data);
          }
        });
      }
      fetchUser();
    }
  }, [groups, trigger]);

  const handleOfferClick = async (offer) => {
    let param = window.location.href;
    let totalParam = param.slice(param.indexOf("vk_access"));

    const response = await fetch(
      `https://europe-central2-loans-vk-app.cloudfunctions.net/set-offers-click?${totalParam}&offer=${offer}`,
      {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  // useEffect(async () => {
  //   bridge
  //     .send("VKWebAppAddToFavorites")
  //     .then((data) => {
  //       if (data.result) {
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // Finding group admin rights for a user
  useEffect(() => {
    if (adminInfo.userRights) {
      async function fetchGroup() {
        let param = window.location.href;
        let totalParam = param.slice(param.indexOf("vk_access"));
        let response = await fetch(
          `https://us-central1-loans-vk-app.cloudfunctions.net/check-admin?${totalParam}`
        );
        let adminsGroups = [];

        if (response.ok) {
          let json = await response.json();

          for (let i = 0; i < json.length; i++) {
            for (let j = 0; j < groups.length; j++) {
              if (json[i].id == groups[j].id) {
                adminsGroups.push(json[i]);
              }
            }
          }

          if (adminsGroups.length < 1) {
            setAdminInfo({ ...adminInfo, trueUser: false, userRights: false });
          } else {
            setAdminInfo({
              ...adminInfo,
              trueUser: true,
              adminsGroups: adminsGroups,
            });
          }
        } else {
          setAdminInfo({ ...adminInfo, trueUser: false });
        }
      }
      fetchGroup().catch((e) => {
        console.log(e);
        setAdminInfo({ ...adminInfo, userRights: false });
      });
    }
  }, [adminInfo.userRights]);

  // Group initialization
  useEffect(() => {
    async function fetchGroupInfo() {
      const groupss = await bridge
        .send("VKWebAppGetGroupInfo", {
          group_id: +activeOrganization,
        })
        .then((data) => {
          if (data.id) {
            for (let i = 0; i < groupsFull.length; i++) {
              if (data.id == groupsFull[i].id) {
                data.imgLogoSrc = groupsFull[i].imgSrc;
                data.name = groupsFull[i].name;
                for (let i = 0; i < groupsFull.length; i++) {
                  if (groupsFull[i].id == data.id) {
                    data.offerId = groupsFull[i].offerId;
                    data.offerInfo = groupsFull[i].offerInfo;
                  }
                }
                setCurrentGroup(data);
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (activeOrganization) {
      fetchGroupInfo();
    }
  }, [activeOrganization]);

  useEffect(() => {
    groups.forEach((image, i) => {
      image = new Image();
      image.src = groups[i].imgSrc;
    });
    groupsWithout.forEach((image, i) => {
      image = new Image();
      image.src = groupsWithout[i].imgSrc;
    });
  }, [groups, groupsWithout]);

  const goBack = () => {
    if (history[history.length - 1] == "modal") {
      setPopout(null);
      history.pop();
    } else {
      if (history.length === 1) {
        // Если в массиве одно значение:
        bridge.send("VKWebAppClose", { status: "success" }); // Отправляем bridge на закрытие сервиса.
      } else if (history.length > 1) {
        if (history[history.length - 1] === "comments") {
          setActiveOrganization(null);
          setCurrentGroup(null);
        }
        // Если в массиве больше одного значения:
        history.pop(); // удаляем последний элемент в массиве.
        setActivePanel(history[history.length - 1]); // Изменяем массив с иторией и меняем активную панель.
      } else {
        history.pop(); // удаляем последний элемент в массиве.
        setActivePanel(history[history.length - 1]); // Изменяем массив с иторией и меняем активную панель.
      }
    }
  };

  useEffect(() => {
    if (groupsFull.length >= 1 && user.submited) {
      let copy = Object.assign([], groupsFull);

      for (let i = 0; i < groupsFull.length; i++) {
        if (
          user?.submited?.convertedIds?.includes(groupsFull[i].offerId + "") &&
          !user?.submited?.reviewsWrittenIds?.includes(
            groupsFull[i].offerId + ""
          )
        ) {
          copy[i] = true;
        } else {
          copy[i] = false;
        }
      }
      setWaiting(copy);
    }
  }, [groupsFull, user.submited]);

  function goToPageFull(name, group) {
    if (history[history.length - 1] != name) {
      setLoad(false);
      setRetry({});
      if (history.length > 1 && history[history.length - 1] == "membership") {
        setActiveOrganization(adminInfo?.chosenGroup.id);
      }
      if (group) {
        setActiveOrganization(group?.id);
      }

      // В качестве аргумента принимаем id панели для перехода
      window.history.pushState({ panel: name }, name); // Создаём новую запись в истории браузера
      setActivePanel(name); // Меняем активную панель
      history.push(name); // Добавляем панель в историю
    }
  }

  function getNotifications(date) {
    const currentDate = new Date();
    const notificationDate = new Date(date);

    bridge
      .send("VKWebAppGetLaunchParams")
      .then(async (data) => {
        let param1 = window.location.href;
        let totalParam1 = param1.slice(param1.indexOf("vk_access"));
        if (data.vk_ref.indexOf("notifications") != -1) {
          setNotificationEnter(true);
        }
        if (
          totalParam1.indexOf("ads") != -1 ||
          data.vk_ref.indexOf("feed_ads") != -1
        ) {
          setAdsEnter(true);
        }
        if (
          !data.vk_are_notifications_enabled &&
          currentDate > notificationDate
        ) {
          // bridge
          //   .send("VKWebAppAllowNotifications")
          //   .then((data) => {
          //     if (data.result) {
          //       console.log("AllowNotificationsGood");
          //     } else {
          //       console.log("AllowNotificationsError");
          //     }
          //   })
          //   .catch(async (error) => {
          let param = window.location.href;
          let totalParam = param.slice(param.indexOf("vk_access"));

          const response = await fetch(
            `https://europe-central2-loans-vk-app.cloudfunctions.net/add-notification-date?${totalParam}`,
            {
              method: "GET",
              mode: "no-cors",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(error);
          // });
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }

  useEffect(() => {
    if (retry.name && offersLoad) {
      goToPageFull(retry.name, retry.group);
    }
  }, [groupsFull, user, offersLoad, retry]);

  function goToPage(name, group) {
    if (groupsFull.length >= 1 && user.id && user.submited && offersLoad) {
      setLoad(false);
      goToPageFull(name, group);
    } else {
      setLoad(true);
      setRetry({ name: name, group: group });
      // console.log("go");
      // if (name == "offers") {
      //   console.log(name);
      //   setTimeout(() => {
      //     setLoad(false);
      //     goToPageFull(name, group);
      //   }, 2000);
      // } else {
      //   goToPageFull(name, group);
      // }
    }
  }

  useEffect(() => {
    window.addEventListener("popstate", () => goBack());
  }, []);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
      !isOnline && location.reload();
    };

    setPopout2(
      !isOnline && (
        <div className="wifiLost-wrap">
          <img src={wifiLost} className="wifiLost" />
          <div className="wifiLost-text">
            Отсутствует интернет <br /> соединение
          </div>
        </div>
      )
    );

    // Listen to the online status
    window.addEventListener("online", handleStatusChange);

    // Listen to the offline status
    window.addEventListener("offline", handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);

  const addLastDate = async (approvalDate) => {
    setTrigger2(true);
    let param = window.location.href;
    let totalParam = param.slice(param.indexOf("vk_access"));
    const response = await fetch(
      `https://europe-central2-loans-vk-app.cloudfunctions.net/add-total-date?approvalDate=${approvalDate}&${totalParam}`,
      {
        method: "GET",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      let copy = Object.assign([], groupsFull);
      let copy2 = Object.assign([], groupsOffers);
      var now = new Date();
      for (const item of copy) {
        if (item?.offerInfo?.approvalDate == approvalDate) {
          item.offerInfo.finalDate = +now;
        }
      }
      for (const item of copy2) {
        if (item?.offerInfo?.approvalDate == approvalDate) {
          item.offerInfo.finalDate = +now;
        }
      }
      setGroupsOffers(copy2);
      setTrigger(!trigger);
    });
  };

  const addDate = async (approvalDate, selectedDate, offerId) => {
    let param = window.location.href;
    let totalParam = param.slice(param.indexOf("vk_access"));

    const response = await fetch(
      `https://europe-central2-loans-vk-app.cloudfunctions.net/add-date?approvalDate=${approvalDate}&offerId=${offerId}&selectedDate=${selectedDate}&${totalParam}`,
      {
        method: "GET",
        mode: "no-cors",
      }
    ).then((res) => {
      for (const item of user.submited.conversions) {
        if (item.offerId == offerId && item.approvalDate == approvalDate) {
          item.selectedDate = selectedDate;
        }
      }
      setPopout2();
      setModalsCounter(true);
    });
  };

  useEffect(() => {
    if (user?.submited?.conversions) {
      let count = 0;
      for (const item of user?.submited?.conversions) {
        count++;
        if (!item.selectedDate) {
          let logo = "";
          let offerName = "";
          for (const group of groupsFull) {
            if (group.offerId == item.offerId) {
              offerName = group.name;
              logo = group.imgSrc;
            }
          }
          for (const group of groupsWithout) {
            if (group.offerId == item.offerId) {
              offerName = group.name;
              logo = group.imgSrc;
            }
          }
          modalsCounter && setModalsCounter(false);
          setPopout2(
            <Modal
              userName={user.first_name}
              date={item.approvalDate}
              offerId={item.offerId}
              addDate={addDate}
              // fetchPos={fetchPos}
              logo={logo}
              offerName={offerName}
              modalsCounter={modalsCounter}
            />
          );
        }
      }
    }
  }, [user.submited, modalsCounter, groupsFull]);

  return (
    <ConfigProvider isWebView>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout popout={popout2}>
            <SplitCol>
              <View
                activePanel={activePanel}
                history={history}
                onSwipeBack={goBack}
              >
                <Home
                  id="home"
                  goToPage={goToPage}
                  onChange={handleSumChange}
                  rngValue={rngValue}
                  load={load}
                />
                <Offers
                  id="offers"
                  firstLoad={firstLoad}
                  handleOfferClick={handleOfferClick}
                  clickedOffers={clickedOffers}
                  goToPage={goToPage}
                  rngValue={rngValue}
                  groups={groupsFull}
                  groupsWithout={groupsWithout}
                  user={user}
                  waiting={waiting}
                  addLastDate={addLastDate}
                  setWaiting={setWaiting}
                  groupsOffers={groupsOffers}
                  doOffers={doOffers}
                  notificationEnter={notificationEnter}
                  adsEnter={adsEnter}
                />
                <Comments
                  id="comments"
                  goToPage={goToPage}
                  user={user}
                  currentGroup={currentGroup}
                  groups={groupsFull}
                  setActiveOrganization={setActiveOrganization}
                  chosenGroup={adminInfo?.chosenGroup}
                  setUpdateReviews={setUpdateReviews}
                  popout={popout}
                  setPopout={setPopout}
                  history={history}
                  updateReviews={updateReviews}
                />
                <Membership
                  id="membership"
                  goToPage={goToPage}
                  setAdminInfo={setAdminInfo}
                  adminInfo={adminInfo}
                />
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
