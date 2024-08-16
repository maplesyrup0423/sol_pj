import React, { useState, useEffect } from "react";
import TestComponent from "./test/TestComponent";
import MyProfile from "./component/mypage/MyProfile";
import HomePage from "./component/HomePage";
import Chat from './Chat/Chat';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function App() {
    const [testComponent, setTestComponent] = useState([]);

    useEffect(() => {
        const callApi = async () => {
            const response = await fetch("/api/test");
            const body = await response.json();
            return body;
        };
        callApi()
            .then((res) => setTestComponent(res))
            .catch((err) => console.log(err));
    }, []);

    return (
        <Router>
            <MainContent testComponent={testComponent} />
        </Router>
    );
}

function MainContent({ testComponent }) {
    const location = useLocation();

    return (
        <div className="App">
            {/* /chat경로가 아니면 다른컴포넌트 호출 */}
            {location.pathname !== "/chat" && (
                <>
                    {testComponent && testComponent.map((u) => (
                        <TestComponent key={u.user_no} {...u} />
                    ))}
                    {/* 내정보 프로필 카드의 미리보기 */}
                    <MyProfile />
                </>
            )}

            {/* 라우팅 처리 */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </div>
    );
}

export default App;
