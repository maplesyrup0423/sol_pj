import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import MyProfile from "./component/mypage/MyProfile";
import HomePage from "./component/HomePage";
import Chat from "./Chat/Chat";

function App() {
    return (
        <Router>
            <MainContent />
        </Router>
    );
}

function MainContent() {
    const location = useLocation();

    return (
        <div className="App">
            {/* /chat 경로가 아니면 MyProfile 컴포넌트를 호출 */}
            {/* myProfile 모습이 필요할 때만 주석 해제하면됨 */}
            {/* <MyProfile /> */}
            {/* {location.pathname !== "/chat" && <MyProfile />} */}

            {/* 라우팅 처리 */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </div>
    );
}

export default App;
