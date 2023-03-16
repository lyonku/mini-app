function MembershipChosenGroup({
  Logo,
  Back,
  goToPage,
  chosenGroupImg,
  chosenGroupName,
}) {
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
      <div className="membership__chosenGroup">
        <img src={chosenGroupImg} className="membership__chosenGroup-img" />
        <div className="membership__chosenGroup-text">
          {"Вы можете отвечать на отзывы о компании " + chosenGroupName}
        </div>
      </div>
      <div className="membership__footer">
        <input
          type="submit"
          value="Показать отзывы"
          className="membership__footer-btn"
          onClick={() => goToPage("comments")}
          data-to="comments"
          data-page="membership"
        />
      </div>
    </div>
  );
}
export default MembershipChosenGroup;
