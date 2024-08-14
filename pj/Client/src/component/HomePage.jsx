import "./HomePage.css";
import LeftNav from "./left/LeftNav.jsx";
import RightNav from "./right/RightNav.jsx";
import CenterContent from "./center/CenterContent.jsx";

function HomePage() {
    return (
        <div className="container">
            <div className="leftNav">
                <LeftNav />
            </div>

            <div className="center">
                <CenterContent />
            </div>

            <div className="rightNav">
                <RightNav />
            </div>
        </div>
    );
}

export default HomePage;
