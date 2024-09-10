import React, { useState } from 'react';
import "./SearchBox.css";
import { BiSearch } from "react-icons/bi";



function SearchBox() {
    const [inputText, setInputText] = useState('');

    const activeButton = () => {
        //버튼 클릭 이벤트
        alert(`${inputText} 검색!`); //임시
    }
    //엔터키 입력 했을 때 버튼 이벤트 실행
    const activeEnter = (e) => {
        if(e.key === 'Enter'){
            activeButton();
        }
    }
    
    
    return (
        <div className="searchBox">
            <button className='searchButton' onClick={activeButton}><BiSearch className='searchButton_icon' /></button>
            <input className="searchInput" type="text" placeholder= "검색"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => activeEnter(e)} />      

        </div>
    );
}

export default SearchBox;