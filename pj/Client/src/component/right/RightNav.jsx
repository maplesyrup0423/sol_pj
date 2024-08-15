import "./RightNav.css";

function RightNav() {
    return (
        <div className="rsidebar">
            <h2>My Sidebar</h2>
            <ul>
                <li>
                    <a href="#Search">Search</a>
                </li>
                <li>
                    <a href="#Alarm">Alarm</a>
                </li>
                <li>
                    <a href="#about">Messenger</a>
                </li>
                <li>
                    <a href="#Footer">Footer</a>
                </li>
            </ul>
        </div>
    );
}

export default RightNav;