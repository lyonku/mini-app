function MembershipMain({ handleUserRights, adminInfo }) {
  return (
    <div className="membership__main">
      <div className="membership__main-wrapper">
        <div className="membership__main-title">
          Вы представитель МФО / МКК?
        </div>
        <div className="membership__main-text">
          <p>Для ответов на отзывы пользователей, мы проверим:</p>
          <ul>
            <li>
              МФО / МКК должна быть представлена в мини-приложении «Займы
              онлайн»
            </li>
            <li>
              У МФО / МКК должно быть верифицированное сообщество ВКонтакте
            </li>
            <li>
              Вы должны обладать правами администратора в сообществе МФО / МКК
            </li>
          </ul>
        </div>
      </div>
      <div className="membership__main-btnBlock">
        <div className="membership__footer">
          <div className="membership__footer-btn" onClick={handleUserRights}>
            {adminInfo.trueUser == undefined && adminInfo.userRights ? (
              <span className="loaderBtn"></span>
            ) : (
              "Я представитель МФО / МКК"
            )}
          </div>
          <div className="membership__footer-text">
            После нажатия на кнопку «Я представитель МФО / МКК», мы выполним
            проверку прав.
          </div>
        </div>
      </div>
    </div>
  );
}
export default MembershipMain;
