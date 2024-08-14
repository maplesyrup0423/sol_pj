import "./App.css";
import React, { useState, useEffect } from "react";
import TestComponent from "./test/TestComponent";
import MyProfile from "./MyProfile";

function App() {
    const [testComponent, seTestComponent] = useState([]);

    useEffect(() => {
        const callApi = async () => {
            const response = await fetch("/api/test");
            const body = await response.json();
            return body;
        };
        callApi()
            .then((res) => seTestComponent(res))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="App">
            {testComponent
                ? testComponent.map((u) => (
                      <TestComponent key={u.user_no} {...u} />
                  ))
                : ""}
            {/* 내정보 프로필 카드의 미리보기 */}
            <MyProfile />
        </div>
    );
}

export default App;
