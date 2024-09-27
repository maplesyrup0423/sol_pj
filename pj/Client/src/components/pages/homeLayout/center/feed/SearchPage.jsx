import "./SearchPage.css";
import Feeds from "./Feeds";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";
import { IoMdArrowRoundBack } from "react-icons/io";


function SearchPage() {
  const { searchKeyword } = useParams();
  const { userInfo } = useContext(AuthContext); //로그인한 유저 정보
  const [data, setData] = useState([]); // 보여줄 데이터
  const navigate = useNavigate(); // useNavigate 훅 추가(최초 리디렉션시 사용)
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/search/${searchKeyword}`); // searchKeyword를 포함한 API 호출
      setData(response.data); // 데이터를 상태로 저장
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 컴포넌트가 마운트되거나 searchKeyword가 변경될 때 데이터 가져오기
  useEffect(() => {
    if (searchKeyword) {
      fetchData();
    }
  }, [searchKeyword]);

  return (
    <div className="searching_page">
      <div className="searching_back">
        <div className="feed_detail_top_back" onClick={handleBack}>
          <IoMdArrowRoundBack /> 뒤로 가기
        </div>
      </div>
      <div className="searching_top">
        <div className="searching_content">통합 검색</div>
        <div className="searching_user">사용자</div>
      </div>

      <div className="feed">
        {data.length > 0 && userInfo !== null ? (
          <>
            {data.map((p) => (
              <Feeds key={p.post_id} {...p} />
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
