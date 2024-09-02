import "./MessengerUser.css";

function MessengerUser({ ...chat }) {
    return (
        <div className="messengerUser">
            <table className="messengerTable">
                <tr>
                    <td colSpan="3">
                        <div className="messengerDate">{chat.last_date}</div>
                    </td>
                </tr>
                <tr>
                    <td rowSpan={2}>
                        <div className="messengerImageBox">
                            <img
                                className="messengerImage"
                                src=""
                                alt={chat.img}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="messengerName">{chat.room_name}</div>
                    </td>
                    <td rowSpan={2} className="messengerNumberBox">
                        <div className="messengerNumber">
                            {chat.unread_count}
                        </div>
                    </td>{" "}
                    {/*알림갯수 */}
                </tr>
                <tr>
                    <td>
                        <div className="messengerLatestMessage">
                            {chat.last_chat}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    );
}

export default MessengerUser;
