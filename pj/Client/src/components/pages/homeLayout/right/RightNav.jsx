import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";
import AddMessenger from "./AddMessenger";
import { useState, useContext, useEffect } from "react";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import FriendList from "./friendList";
import { AuthContext } from "../../../../Context/AuthContext";

function RightNav() {
    const { userInfo } = useContext(AuthContext);
    useEffect(() => {
        console.log("라이트네비 유저인포 가져오기 : ", userInfo);
    }, [userInfo]);

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
                                    setActiveTab("userList");
                                }}
                            >
                                <FaUserGroup size={45} />
                            </button>
                        </div>
                        {activeTab === "messenger" && <Messenger />}
                        {/* 반복 */}
                        {activeTab === "userList" && (
                            <FriendList user_no={userInfo.user_no} />
                        )}
                        <AddMessenger />
                    </li>
                </ul>
            </main>
            <Footer />
        </div>
    );
}

export default RightNav;
