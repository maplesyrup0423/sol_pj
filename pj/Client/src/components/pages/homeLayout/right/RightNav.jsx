import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";
import AddMessenger from "./AddMessenger";
import { useState } from "react";
import UserList from "./UserList";
import { BsChatLeftDots, BsChatLeftDotsFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";

function RightNav() {
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
                        {activeTab === "userList" && <UserList />}
                    </li>
                </ul>
                <AddMessenger />
            </main>
            <Footer />
        </div>
    );
}

export default RightNav;
