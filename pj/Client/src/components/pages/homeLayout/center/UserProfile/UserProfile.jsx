import { useState } from "react";
import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";

function UserProfile({ myInfo }) {
    //현재 선택된 탭 관리
    const [activeTab, setActiveTab] = useState("posts");

    //switch-posts 클릭시 호출
    const showPosts = () => {
        setActiveTab("posts");
    };

    //switch-comments 클릭시 호출
    const showComments = () => {
        setActiveTab("comments");
    };

    console.log("myInfo : ", myInfo);
    console.log("myInfo.nickname : ", myInfo.nickname);
    return (
        <>
            <header>
                <div className="backArrow">
                    <BackArrow />
                </div>
                <div className="userInfo">
                    <div className="name">{myInfo[0].nickname}</div>
                    <div className="nickName">@{myInfo[0].user_id}</div>
                </div>
            </header>
            <main>
                <div className="userContainer">
                    <div className="userPic">
                        <div className="pic">
                            <img
                                src={myInfo[0].image_url}
                                alt=""
                                className="proImg"
                            />
                        </div>
                    </div>
                    <div className="userInfo">
                        <div className="name">{myInfo[0].nickname}</div>
                        <div className="nickName">@{myInfo[0].user_id}</div>
                        <div className="introduce">{myInfo[0].introduce}</div>
                        <div className="editProfile">
                            <BasicButton btnText="프로필수정" />
                        </div>
                    </div>
                </div>
                <div className="switch">
                    <div
                        className={`switch-posts ${
                            activeTab === "posts" ? "active" : ""
                        }`}
                        onClick={showPosts}
                    >
                        게시글
                    </div>
                    <div
                        className={`switch-comments ${
                            activeTab === "comments" ? "active" : ""
                        }`}
                        onClick={showComments}
                    >
                        댓글
                    </div>
                </div>
                <div className="list">
                    <div className="content">
                        {activeTab === "posts" && (
                            <div className="posts">게시글 누르면 이게 나옴</div>
                        )}
                        {activeTab === "comments" && (
                            <div className="comments">
                                댓글 누르면 이게 나옴
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
export default UserProfile;
