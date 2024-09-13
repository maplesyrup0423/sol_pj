import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import api from "../../../../auth/api";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

function Like(props) {
  const [like_count, setLike_count] = useState(props.like_count);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    // 페이지 로딩 시 사용자가 이미 좋아요를 눌렀는지 확인
    api
      .get(`/api/posts/${props.postId}/isLikedByUser/${props.loginUser_no}`)
      .then((res) => setLiked(res.data.liked))
      .catch((err) => console.error(err));
  }, [props.postId, props.loginUser_no]);

  const handleLike = () => {
    if (props.user_no === props.loginUser_no) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "자신의 게시글에는 좋아요를 누를 수 없습니다.",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        customClass: {
          title: "custom-swal-title",
        },
      });
      return;
    }

    if (liked) {
      // 좋아요 취소
      api
        .post(`/api/posts/${props.postId}/unlike/${props.loginUser_no}`)
        .then(() => setLiked(false), setLike_count(like_count - 1))
        .catch((err) => console.error(err));
    } else {
      // 좋아요 등록
      api
        .post(`/api/posts/${props.postId}/like`, {
          user_no: props.loginUser_no,
        })
        .then(() => setLiked(true), setLike_count(like_count + 1))
        .catch((err) => console.error(err));
    }
    //props.refreshData();
  };

  return (
    <>
      <div className="like-comment-btn" onClick={handleLike}>
        {liked ? (
          <>
            <AiFillHeart
              size="30"
              className="heart-icon liked"
              id="AiFillHeart"
            />
          </>
        ) : (
          <>
            <AiOutlineHeart
              size="30"
              className="heart-icon"
              id="AiOutlineHeart"
            />
          </>
        )}
        <span> {like_count} </span>
      </div>
    </>
  );
}
export default Like;
