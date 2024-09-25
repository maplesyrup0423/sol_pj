import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";
import { useState, useContext, useEffect } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { AuthContext } from "../../../../Context/AuthContext";
import Followers from "./Followers";
import { getFollowers } from "../../../utills/FollowService";
import { LuMail } from "react-icons/lu";

function RightNav() {
  const { userInfo } = useContext(AuthContext);
  const [followerList, setFollowerList] = useState([]);
  const [activeTab, setActiveTab] = useState("messenger");

  // 유저 정보가 바뀌거나 activeTab이 "followers"로 바뀌면 팔로워 목록 불러오기
  useEffect(() => {
    if (userInfo && activeTab === "followers") {
      // 팔로워 목록 불러오기
      const fetchFollowers = async () => {
        const list = await getFollowers(userInfo.user_no);
        setFollowerList(list);
      };
      fetchFollowers();
    }
  }, [userInfo, activeTab]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="rsidebar">
      <main>
        <ul>
          <li>
            <SearchBox />
          </li>
          <li>
            <Notice user_no={userInfo.user_no} />
          </li>
          <li>
            <div className="activeTab">
              <button
                className="activeChat"
                onClick={() => handleTabChange("messenger")}
              >
                <LuMail size={40} />
              </button>
              <button
                className="activeChat"
                onClick={() => {
                  if (userInfo && userInfo.user_no) {
                    handleTabChange("followers");
                  } else {
                    console.error("유저 정보가 아직 로드되지 않았습니다.");
                  }
                }}
                disabled={!userInfo || !userInfo.user_no}
              >
                <FaUserGroup size={40} />
              </button>
            </div>
            {activeTab === "messenger" && <Messenger />}
            {activeTab === "followers" && (
              <Followers followerList={followerList} />
            )}
          </li>
        </ul>
        <div className="RightNav-Footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default RightNav;
