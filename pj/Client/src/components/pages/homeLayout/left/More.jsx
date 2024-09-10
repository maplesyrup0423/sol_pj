import "./More.css";
import { CgMoreO } from "react-icons/cg";
import { useState } from "react";
import BoardMore from "./BoardMore"; // 모달 컴포넌트 불러오기

function More({ onBoardInfoUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onBoardInfoUpdate();
  };

  return (
    <li>
      <div className="moreContainer" onClick={openModal}>
        <div className="more_image">
          <CgMoreO size={30} />
        </div>
        <div className="more_text">&nbsp; 더보기</div>
      </div>
      {isModalOpen && <BoardMore onClose={closeModal} />}
    </li>
  );
}

export default More;
