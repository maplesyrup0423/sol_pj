import "./WriteComment.css";
import ProfileImg from "../../../../utills/ProfileImg";

function WriteComment({ userInfo, boardId, postId }) {


    return(
        <div className="write_comment">
            <div className="comment_profile">
                <ProfileImg image_url={userInfo.image_url} />
            </div>
            <div className="comment_box">
                <textarea name="" id=""></textarea>
            </div>
            <div className="comment_button">
                <button className="post_comment_button">등록</button>
            </div>
        </div>
    );
}

export default WriteComment;