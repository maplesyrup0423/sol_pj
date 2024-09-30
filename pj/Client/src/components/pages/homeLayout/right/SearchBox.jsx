import { useState } from "react";
import "./SearchBox.css";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();

  const activeButton = () => {
    //버튼 클릭 이벤트
    alert(`${inputText} 검색!`); //임시
    const searchKeyword = inputText;
    try {
      navigate(`/search/${searchKeyword}`);
    } catch (error) {
      console.error("검색 오류! :", error);
      alert("다시 시도해주세요!");
    }
  };

  //엔터키 입력 했을 때 버튼 이벤트 실행
  const activeEnter = (e) => {
    if (e.key === "Enter") {
      activeButton();
    }
  };

  return (
    <div className="searchBox">
      <button className="searchButton" onClick={activeButton}>
        <BiSearch className="searchButton_icon" />
      </button>
      <input
        className="searchInput"
        type="text"
        placeholder="검색"
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => activeEnter(e)}
      />
    </div>
  );
}

export default SearchBox;
