import "./Footer.css";

function Footer() {
    return (
        <div className="footer">
            <div className="footer terms"><a href="">이용약관</a></div>
            
            <div className="footer policy"><a href="">개인정보처리방침</a></div>
            
            <div className="footer cookie"><a href="">쿠키정책</a></div>
        </div>
    );
}

export default Footer;