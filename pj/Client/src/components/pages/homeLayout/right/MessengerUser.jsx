import "./MessengerUser.css";

function MessengerUser({ ...chat }) {
  console.log("chat", chat);
  return (
    <div className="messengerUser">
      {/* messengerTable 부분 테이블 태그로 만들어져 있는데
            css수정할 때 불편한 부분이 많아서 div나 ul>div 로 대체해도 되는지  */}
      <table className="messengerTable">
        <tr>
          <td colSpan="3">
            <div className="messengerDate">{chat.last_date}</div>
          </td>
        </tr>
        <tr>
          <td rowSpan={2}>
            <div className="messengerImageBox">
              <img className="messengerImage" src="" alt="" />
            </div>
          </td>
          <td>
            <div className="messengerName">{chat.room_name}</div>
          </td>
          <td rowSpan={2} className="messengerNumberBox">
            <div className="messengerNumber">{chat.unread_count}</div>
          </td>
          {/*알림갯수 */}
        </tr>
        <tr>
          <td>
            <div className="messengerLatestMessage">{chat.last_chat}</div>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default MessengerUser;
