import "./BoardInfo.css";
import BoardName from "./BoardName.jsx"
import More from "./More.jsx"

function BoardInfo() {
    const titles = ['1번', '2번', '3번', '4번', '5번'];
    const gameList = titles.map((title, index) => <BoardName/>);

    return (
        <div className="GameInfo">
            <ul>
                {/*보드네임 부분은 반복, 모어는 안반복 */}
                {gameList}
                
                <More/>
            </ul>
        </div>
    );
}

export default BoardInfo;