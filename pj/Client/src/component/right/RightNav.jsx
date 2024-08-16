import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";

function RightNav() {
    return (
        <div className="rsidebar">
            <ul>
                <li>
                    <SearchBox />
                </li>
                <li>
                    <Notice />
                </li>
                <li>
                    <Messenger/>
                </li>
                <li>
                    <Footer/>
                </li>
            </ul>
        </div>
    );
}

export default RightNav;