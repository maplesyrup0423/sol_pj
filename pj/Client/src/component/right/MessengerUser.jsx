import "./MessengerUser.css";

function MessengerUser() {
    return (
        <div className="messengerUser">
            <table>
                <tr>
                    <td colSpan="3">2024-08-16</td>
                </tr>
                <tr>
                    <td rowSpan={2}><img src="" alt="프로필 이미지" /></td>
                    <td>이름</td>
                    <td rowSpan={2}><span>100</span></td> {/*알림갯수 */}
                </tr>
                <tr>
                    <td>가장 마지막 채팅</td>
                </tr>
            </table>
        </div>
    );
}

export default MessengerUser;