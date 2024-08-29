import { Link } from "react-router-dom";

function IntroCard({ title, description, more }) {
    return (
        <div className="intro-card">
            <div className="intro-info">
                <img src="/assets/courses.png" alt="" />
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <Link to="/">{more}</Link>
        </div>
    );
}

export default IntroCard;
