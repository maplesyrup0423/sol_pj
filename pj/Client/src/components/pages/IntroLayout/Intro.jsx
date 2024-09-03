import { Link } from "react-router-dom";
import "./Intro.css";
import IntroCard from "./IntroCard";

function IntroPage() {
    return (
        <div className="intro-board">
            <div className="intro-container">
                <h1>프로젝트 소개</h1>
                {/* <p>소개소개소개소개소개12312313소개소개 ㅎㅎ</p> */}
                <Link to="/login">start</Link>
            </div>
            <div className="blank"></div>
            <div className="intro-container-second">
                <IntroCard />
                <div className="intro-card">
                    <div className="intro-info">
                        <img src="/assets/team.png" alt="" />
                        <h3>Team</h3>
                        <p>지금까지 내가 했던건 대체 무얼위해...</p>
                    </div>
                    <a href="/">Lrearn More</a>
                </div>
                <div className="intro-card">
                    <div className="intro-info">
                        <img src="/assets/contact.png" alt="" />
                        <h3>Contact Us</h3>
                        <p>끼얏호우</p>
                    </div>
                    <a href="/">Lrearn More</a>
                </div>
            </div>
            <div className="intro-blank-2">
                <div className="intro-footer">
                    <div className="intro-column">
                        <h3>Services</h3>
                        <ul>
                            <li>
                                <a href="/">Email Marketing</a>
                            </li>
                            <li>
                                <a href="/">campaigns</a>
                            </li>
                            <li>
                                <a href="/">Branding</a>
                            </li>
                        </ul>
                    </div>
                    <div className="intro-column">
                        <h3>About</h3>
                        <ul>
                            <li>
                                <a href="/">Our Story</a>
                            </li>
                            <li>
                                <a href="/">Benifits</a>
                            </li>
                            <li>
                                <a href="/">Careers</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntroPage;
