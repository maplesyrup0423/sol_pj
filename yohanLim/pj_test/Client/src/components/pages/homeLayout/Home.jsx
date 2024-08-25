import "./Home.css";
import LeftNav from "./left/LeftNav.jsx";
import RightNav from "./right/RightNav.jsx";
import CenterContent from "./center/CenterContent.jsx";
import { useState, useEffect } from "react";

function HomePage() {
    const [myInfo, setMyInfo] = useState([]);

    useEffect(() => {
        const myInfoCallApi = async () => {
            //유저 번호, 아이디, 프로필사진, 닉네임 받아옴
            const response = await fetch("/api/myInfo");
            const body = await response.json();
            console.log(body); // 서버 응답 확인용
            return body;
        };
        myInfoCallApi()
            .then((res) => setMyInfo(res))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="container">
            <div className="leftNav">
                {myInfo.length > 0 ? <LeftNav myInfo={myInfo} /> : ""}
            </div>

            <div className="center">
                {myInfo.length > 0 ? (
                    <CenterContent image_url={myInfo[0].image_url} />
                ) : (
                    ""
                )}
            </div>

            <div className="rightNav">
                <RightNav />
            </div>
        </div>
    );
}

export default HomePage;
