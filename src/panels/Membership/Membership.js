import React, { useState } from "react";
import PropTypes from "prop-types";

import "./Membership.css";

import accessDenied from "img/accessDenied.svg";
import Logo from "img/SmartMoneyLogo.png";
import Back from "img/chevron-back.svg";
import MembershipChosenGroup from "./components/MembershipChosenGroup";
import MembershipMain from "./components/MembershipMain";
import MembershipForm from "./components/MembershipForm";

const Membership = ({ goToPage, setAdminInfo, adminInfo }) => {
  const showReviews = (event) => {
    event.preventDefault();
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i]?.checked) {
        adminInfo.adminsGroups.map((group) => {
          if (group.id == event.target[i].id) {
            setAdminInfo({ ...adminInfo, chosenGroup: group });
          }
        });
      }
    }
  };

  const handleUserRights = () => {
    setAdminInfo({ ...adminInfo, userRights: true });
  };

  if (adminInfo.chosenGroup) {
    return (
      <MembershipChosenGroup
        goToPage={goToPage}
        Back={Back}
        Logo={Logo}
        chosenGroupImg={adminInfo.chosenGroup.imgSrc}
        chosenGroupName={adminInfo.chosenGroup.name}
      />
    );
  }

  return (
    <div className="membership">
      <div className="membership__header">
        <img
          src={Back}
          alt="Back"
          className="header-Back"
          onClick={() => window.history.back()}
          data-to="home"
        />
        <div className="membership__logo">
          <img src={Logo} className="membership__logo-img" />
          <div className="membership__logo-text">Займы онлайн</div>
        </div>
      </div>

      {adminInfo?.trueUser == true ? (
        <MembershipForm showReviews={showReviews} adminInfo={adminInfo} />
      ) : adminInfo?.trueUser == false ? (
        <div className="membership__accessDenied">
          <img src={accessDenied} className="membership__accessDenied-img" />
          <div className="membership__accessDenied-title">
            Мы не нашли у вас доступа к компаниям
          </div>
        </div>
      ) : (
        <MembershipMain
          handleUserRights={handleUserRights}
          adminInfo={adminInfo}
        />
      )}
    </div>
  );
};

Membership.propTypes = {
  id: PropTypes.string.isRequired,
  goToPage: PropTypes.func.isRequired,
};

export default Membership;
