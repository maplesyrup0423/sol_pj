import "./BackArrow.css";

function BackArrow() {
    return (
        <div
            className="backArrow"
            onClick={() => {
                alert("뒤로가기");
            }}
        >
            {/* 구글폰트 아이콘 사이트에서 끌어온 x 아이콘임 수정하지맛 */}
            <span className="material-symbols-outlined">arrow_back</span>
        </div>
    );
}

export default BackArrow;
