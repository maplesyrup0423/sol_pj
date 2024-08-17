import "./LeftNav.css";
import BoardInfo from "./BoardInfo";
import ProfileCard from "./ProfileCard";

function LeftNav() {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <div className="logoCon">
                    <button className="logoButton"><img src="" alt="로고 이미지" />로고를 누르면 새로고침</button>
                    </div>
                </li>
                <li>
                    <BoardInfo/>
                </li>

                <li>
                    <a href="#profileCard"><ProfileCard /></a>
                </li>
            </ul>
        </div>
    );
}

export default LeftNav;
