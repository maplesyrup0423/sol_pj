import "./Closebtn.css";

function Closebtn() {
    return (
        <div
            className="closebtn"
            onClick={() => {
                alert("닫기");
            }}
        >
            {/* 구글폰트 아이콘 사이트에서 끌어온 x 아이콘임 수정하지맛 */}
            <span className="material-symbols-outlined">close</span>
        </div>
    );
}

export default Closebtn;
