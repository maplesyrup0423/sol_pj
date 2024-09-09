import "./FeedMain.css";
import Feeds from "./Feeds";
import FeedDetail from "./FeedDetail";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";

function FeedMain() {
    const { userInfo } = useContext(AuthContext);
    const { boardId: paramBoardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
    const [data, setData] = useState([]);
    const [defaultBoardId, setDefaultBoardId] = useState([]);
    const navigate = useNavigate(); // useNavigate 훅 추가

    const fetchBoardInfoUser = async () => {
        try {
            const response = await api.get(
                `/api/boardInfoUser?user_no=${userInfo.user_no}`
            );
            const boardIds = response.data.map((item) => item.board_info_id);

            if (boardIds.length > 0) {
                // 가장 작은 값 찾기
                const minBoardId = Math.min(...boardIds);
                setDefaultBoardId(minBoardId); // 가장 작은값
                // URL에 기본 게시판 ID로 리디렉션
                if (!paramBoardId) {
                    navigate(`/post/${minBoardId}`, { replace: true });
                }
            } else {
                setDefaultBoardId(1); // 데이터가 없는 경우 1로 설정
            }
        } catch (err) {
            console.error("Error fetching board info:", err);
        }
    };
    const boardId = paramBoardId || defaultBoardId; // boardId가 undefined일 때 기본값 설정

    const fetchData = async () => {
        try {
            const response = await api.get(
                `/api/post?board_info_id=${boardId}&orderBy=${
                    activeTab === "post_pop" ? "pop" : "date"
                }`
            );
            setData(response.data);
            // console.log(`Fetching posts with orderBy: ${activeTab === 'post_pop' ? 'pop' : 'date'}`);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [activeTab, setActiveTab] = useState("post_date");

    const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물을 관리하는 상태

    const orderBy_pop = () => {
        setActiveTab("post_pop");
        //fetchData();
    };

    const orderBy_date = () => {
        setActiveTab("post_date");
        //fetchData();
    };
    useEffect(() => {
        fetchBoardInfoUser();
    }, [userInfo]);

    useEffect(() => {
        const container = document.querySelector(".homeContainer"); // 스크롤이 발생하는 컨테이너 선택
        if (container) {
            container.scrollTop = 0;
        }
        fetchData();
    }, [boardId, activeTab, defaultBoardId]);

    let [btnActive, setBtnActive] = useState(false);

    const toggleActive = (e) => {
        setBtnActive((prev) => {
            return !prev;
        });
    };

    const handlePostClick = (post) => {
        setSelectedPost(post); // 게시물이 클릭되면 선택된 게시물을 설정
    };

    const handleBackToFeed = () => {
        setSelectedPost(null); // 세부 화면에서 다시 목록으로 돌아가면 null로 설정
    };

    // FeedDetail을 표시할 때 FeedMain의 전체 UI가 FeedDetail로 대체됨
    if (selectedPost) {
        return (
            <div className="feed_main">
                <FeedDetail post={selectedPost} onBack={handleBackToFeed} />
            </div>
        );
    }

    return (
        <div className="feed_main">
            <div className="order">
                <div
                    className={"popularity" + (btnActive ? "" : " active")}
                    onClick={toggleActive}
                >
                    <div
                        className={`switch-date ${
                            activeTab === "post_date" ? "active" : ""
                        }`}
                        onClick={orderBy_date}
                    >
                        <div
                        // className={"late" + (btnActive ? "" : " active")}
                        // onClick={toggleActive}
                        >
                            최신
                        </div>
                    </div>
                </div>

                <div
                    className={"Latest" + (btnActive ? " active" : "")}
                    onClick={toggleActive}
                >
                    <div
                        className={`switch-pop ${
                            activeTab === "post_pop" ? "active" : ""
                        }`}
                        onClick={orderBy_pop}
                    >
                        <div
                        // className={"pop" + (btnActive ? " active" : "")}
                        // onClick={toggleActive}
                        >
                            인기
                        </div>
                    </div>
                </div>
            </div>

            <div className="posting">
                {/* 글쓰기 부분*/}
                {userInfo ? (
                    <Writing
                        userInfo={userInfo}
                        boardId={boardId}
                        refreshPosts={fetchData}
                    />
                ) : (
                    ""
                )}
            </div>

            <div className="feed_orders">
                <div className="feed_contents">
                    {activeTab === "post_pop" && (
                        <div className="feed">
                            {data.length > 0 ? (
                                data.map((p) => (
                                    <Feeds
                                        key={p.post_id}
                                        {...p}
                                        onClick={() => handlePostClick(p)}
                                    />
                                ))
                            ) : (
                                <h1>Loading...</h1>
                            )}
                        </div>
                    )}
                    {activeTab === "post_date" && (
                        <div className="feed">
                            {data.length > 0 ? (
                                data.map((p) => (
                                    <Feeds
                                        key={p.post_id}
                                        {...p}
                                        onClick={() => handlePostClick(p)}
                                    />
                                ))
                            ) : (
                                <h1>Loading...</h1>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* <div className="feed">
        {data.length > 0 ? (
          data.map((p) => <Feeds key={p.post_id} {...p} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div> */}
        </div>
    );
}

export default FeedMain;
