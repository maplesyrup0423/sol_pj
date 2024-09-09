import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";
import AddMessenger from "./AddMessenger";
import { useState, useContext, useEffect } from "react";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { AuthContext } from "../../../../Context/AuthContext";
import Followers from "./Followers";
import api from "../../../auth/api";

function RightNav() {
    const { userInfo } = useContext(AuthContext);
    const [followerList, setFollowerList] = useState([]);
    useEffect(() => {
        if (userInfo) {
            //console.log("라이트네비 유저인포 가져오기 : ", userInfo);
        } else {
            console.log("유저 정보가 없습니다.");
        }
    }, [userInfo]);

    const followers = async () => {
        try {
            const response = await api.get("/followers", {
                userInfo,
            });

            const data = response.data;
            // const followersList = JSON.stringify(data.followers, null, 2);

            if (data.success) {
                //console.log("리스폰스된 유저 정보 : " + followersList);
                setFollowerList(response.data.followers);
            } else {
                alert(
                    "유저 정보를 가져올 수 없습니다. 오류 메시지: " +
                        data.message
                ); // 오류 메시지 포함
            }
        } catch (error) {
            console.error("유저 정보를 가져오는 중 오류 발생:", error);
        }
    };

    const [activeTab, setActiveTab] = useState("messenger");

    return (
        <div className="rsidebar">
            <main>
                <ul>
                    <li>
                        <SearchBox />
                    </li>
                    <li>
                        <Notice />
                    </li>
                    <li>
                        <div className="activeTab">
                            <button
                                className="activeChat"
                                onClick={() => {
                                    setActiveTab("messenger");
                                }}
                            >
                                <BsChatLeftDotsFill size={45} />
                            </button>
                            <button
                                className="activeChat"
                                onClick={() => {
                                    if (userInfo && userInfo.user_no) {
                                        followers();
                                        setActiveTab("followers");
                                    } else {
                                        console.error(
                                            "유저 정보가 아직 로드되지 않았습니다."
                                        );
                                    }
                                }}
                                disabled={!userInfo || !userInfo.user_no}
                            >
                                <FaUserGroup size={45} />
                            </button>
                        </div>
                        {activeTab === "messenger" && <Messenger />}
                        {/* 반복 */}
                        {activeTab === "followers" && (
                            <Followers followerList={followerList} />
                        )}
                        {/* <AddMessenger /> */}
                    </li>
                </ul>
            </main>
            <Footer />
        </div>
    );
}

export default RightNav;
