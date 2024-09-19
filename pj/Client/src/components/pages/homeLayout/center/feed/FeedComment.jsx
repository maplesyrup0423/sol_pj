import "./FeedComment.css";
import { AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";

function FeedComment() {

    return(
        <div className="FeedComment_contents">
            <div className="FeedComment_head">
                <div className="FeedComment_profile"> 이미지 </div>
                <div className="FeedComment_body">
                    <div className="FeedComment_up">
                        <div className="FeedComment_name"> 임시이름 </div>
                        <div className="FeedComment_id"> @임시아이디</div>
                    </div>
                    <div className="FeedComment_down">
                        <div className="FeedComment_comment">댓글입니다ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ</div>
                    </div>
                </div>
            </div>

            <div className="FeedComment_foot">
                <div className="FeedComment_heart"><AiOutlineHeart /></div>
                <div className="FeedComment_reply"><IoChatbubbleOutline/></div>
                <div className="FeedComment_date">2024-09-09</div>
            </div>

        </div>
    );

}

export default FeedComment;