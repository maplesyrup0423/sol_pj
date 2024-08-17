import "./Savebtn.css";

function Savebtn() {
    return <button className="Savebtn" onClick={() => {
        alert('저장되었습니다.')
    }}>저장</button>
}

export default Savebtn;