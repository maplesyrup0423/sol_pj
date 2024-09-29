import "./RightNav.css";
import SearchBox from "./SearchBox";
import Notice from "./Notice";
import Messenger from "./Messenger";
import Footer from "./Footer";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext";

function RightNav() {
  const { userInfo } = useContext(AuthContext);

  return (
    <div className="rsidebar">
      <main>
        <ul>
          <li>
            <SearchBox />
          </li>
          <li>
            <Notice user_no={userInfo.user_no} />
          </li>
          <li>
            <Messenger />
          </li>
        </ul>
        <div className="RightNav-Footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default RightNav;
