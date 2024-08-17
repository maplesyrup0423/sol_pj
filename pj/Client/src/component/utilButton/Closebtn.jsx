import "./Closebtn.css";

function Closebtn() {
    return <div ClassName="closebtn" onClick={()=>{
        alert('닫기')
    }}>
    <span class="material-symbols-outlined">
        close
    </span>
    </div>
}

export default Closebtn;