import "./LeftNav.css";

function LeftNav() {
    return (
        <div class="sidebar">
            <h2>My Sidebar</h2>
            <ul>
                <li>
                    <a href="#home">Home</a>
                </li>
                <li>
                    <a href="#services">Services</a>
                </li>
                <li>
                    <a href="#about">About</a>
                </li>
                <li>
                    <a href="#contact">Contact</a>
                </li>
            </ul>
        </div>
    );
}

export default LeftNav;
