import "./SearchPage.css";
import Feeds from "./Feeds";
import { useState, useEffec, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";


function SearchPage() {
  const { searchKeyword } = useParams();
  const { userInfo } = useContext(AuthContext); //로그인한 유저 정보
  const [data, setData] = useState([]); // 보여줄 데이터
  const navigate = useNavigate(); // useNavigate 훅 추가(최초 리디렉션시 사용)

  const fetchData = async () => {
    try {
      const response = await api.get(
        `/api/search?searchKeyword=${searchKeyword}`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="searching_page">
      <div className="searching_top">
        <div className="searching_content">통합 검색</div>
        <div className="searching_user">사용자</div>
      </div>

      <div className="feed">
        {data.length > 0 && userInfo !== null ? (
          <>
            {data.map((p) => (
              <Feeds/>
            ))}
            <div className="scroll-observer"></div>
          </>
        ) : (
          <span className="data-placeholder">게시글이 없습니다.</span>
        )}
      </div>


    </div>


  );
}
export default SearchPage;
