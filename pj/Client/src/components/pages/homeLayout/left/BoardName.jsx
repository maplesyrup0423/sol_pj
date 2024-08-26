import React from "react";
import "./BoardName.css";

function BoardName(props) {
    return (
        <li>
            <div className="gameContainer">
                <div className="gameInfo gameImg"><img src={props.board_img} alt="" /></div>
                <div className="gameInfo gameTitle"> &nbsp; {props.board_info_name}</div>
            </div>
        </li>
    );
}
export default BoardName;