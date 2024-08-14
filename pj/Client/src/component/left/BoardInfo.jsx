import "./BoardInfo.css";
import BoardName from "./BoardName.jsx"
import More from "./More.jsx"

function BoardInfo() {
    return (
        <div class="GameInfo">
            <ul>
                {/*보드네임 부분은 반복, 모어는 안반복 */}
                <BoardName/>
                
                <More/>
            </ul>
        </div>
    );
}

export default BoardInfo;