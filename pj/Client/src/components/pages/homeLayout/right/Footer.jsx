import { NavLink } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <NavLink to="/Policy/TermsOfService">
        <span>이용약관</span>
      </NavLink>
      <span> · </span>
      <NavLink to="/Policy/PrivacyPolicy">
        <span>개인정보 처리방침</span>
      </NavLink>
      <span> · </span>
      <NavLink to="/Policy/CookiePolicy">
        <span>쿠키정책</span>
      </NavLink>
      <span> · </span>
      <NavLink to="/DeveloperInfo">
        <span>개발자</span>
      </NavLink>
    </div>
  );
}

export default Footer;
