import "./WriteComment.css";
import ProfileImg from "../../../../utills/ProfileImg";
import BasicButton from "../../../../utills/buttons/BasicButton";
import React, { useState } from 'react';

function WriteComment({ userInfo, postId }) {

    const [comment, setComment] = useState('');
  
    const handleCommentChange = (e) => {
      setComment(e.target.value);
    };


  return (
    <div className="write_comment">

      <div className="comment_profile">
        <ProfileImg image_url={userInfo.image_url} />
      </div>

      <div className="comment_box">
        <textarea 
          value={comment}
          onChange={handleCommentChange}
          placeholder="댓글 입력창"
        />
      </div>

      <div className="comment_button">
        {/* <button className="post_comment_button">등록</button> */}
      
        <BasicButton
          btnOn={false}
          btnSize="mediumButton"
          btnColor="yellowButton"
          action={null}
          btnText="등록"
        />
      </div>

    </div>
  );
}

export default WriteComment;
