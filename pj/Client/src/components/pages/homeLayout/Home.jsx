import "./Home.css";
import LeftNav from "./left/LeftNav.jsx";
import RightNav from "./right/RightNav.jsx";
import CenterContent from "./center/CenterContent.jsx";
import { useState, useEffect } from "react";

function HomePage() {
  const [myInfo, setMyInfo] = useState([]);

  useEffect(() => {
    const myInfoCallApi = async () => {
      try {
        const response = await fetch("/api/userProfileInfo");

        // 응답 상태 확인
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 응답을 텍스트로 확인
        const responseText = await response.text();
        console.log("Response text:", responseText);

        // JSON 파싱 시도
        try {
          const body = JSON.parse(responseText);
          console.log(body); // 서버 응답 확인용
          return body;
        } catch (jsonError) {
          throw new Error("Invalid JSON: " + jsonError.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        return [];
      }
    };

    myInfoCallApi()
      .then((res) => setMyInfo(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="leftNav">
        {myInfo.length > 0 && <LeftNav myInfo={myInfo} />}
      </div>

      <div className="center">
        {myInfo.length > 0 && <CenterContent image_url={myInfo[0].image_url} />}
      </div>

      <div className="rightNav">
        <RightNav />
      </div>
    </div>
  );
}

export default HomePage;
