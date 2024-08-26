import "./MessengerUser.css";

function MessengerUser() {
    return (
        <div className="messengerUser">
            <table className="messengerTable">
                <tr>
                    <td colSpan="3"><div className="messengerDate">2024-08-16</div></td>
                </tr>
                <tr>
                    <td rowSpan={2}><div className="messengerImageBox"><img className="messengerImage" src="" alt="이미지" /></div></td>
                    <td><div className="messengerName">집가고싶다</div></td>
                    <td rowSpan={2} className="messengerNumberBox"><div className="messengerNumber">100</div></td> {/*알림갯수 */}
                </tr>
                <tr>
                    <td><div className="messengerLatestMessage">왜 아직 1시지??</div></td>
                </tr>
            </table>
        </div>
    );
}

export default MessengerUser;