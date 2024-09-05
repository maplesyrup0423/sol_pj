import FriendItem from "./FriendItem";
import "./Followers.css";
function Followers({ followerList }) {
    // console.log("Followers에서 받아온 친구목록 : ", followerList);
    // followerList가 배열인지 확인하고, 아니라면 빈 배열로 초기화
    const validFollowerList = Array.isArray(followerList) ? followerList : [];

    // console.log(validFollowerList, "배열확인");
    return (
        <div className="friendList">
            {followerList && followerList.length > 0 ? ( // 데이터가 있을 때만 map 실행
                validFollowerList.map((f) => (
                    <FriendItem key={f.following_id} {...f} />
                ))
            ) : (
                <p>친구 목록이 없습니다.</p> // 데이터가 없을 때 출력할 메시지
            )}
        </div>
    );
}

export default Followers;
