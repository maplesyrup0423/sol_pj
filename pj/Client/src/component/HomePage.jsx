import "./HomePage.css";
import LeftNav from "./LeftNav";

function HomePage() {
    return (
        <div className="container">
            <div className="leftNav">
                <LeftNav />
            </div>

            <div className="center">중앙 화면</div>

            <div className="rightNav">오른쪽 바</div>
        </div>
    );
}

export default HomePage;
