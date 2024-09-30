import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import api from "../../../../auth/api";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import "./Like.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { createNotification } from "../../../../utills/NotificationService";
import { AuthContext } from "../../../../../Context/AuthContext";

function Like(props) {
  const { userInfo } = useContext(AuthContext);
  const [like_count, setLike_count] = useState(props.like_count);
  const [liked, setLiked] = useState(false);
  const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };
  // 상세 좋아요 수를 포맷하는 함수
  const detailedNumber = (num) => new Intl.NumberFormat().format(num);

  // 좋아요 수가 축약되지 않았을 때만 툴팁을 표시
  const isAbbreviated = like_count >= 1e3;

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props} className="custom-tooltip">
      {detailedNumber(like_count)}
    </Tooltip>
  );

  useEffect(() => {
    // 페이지 로딩 시 사용자가 이미 좋아요를 눌렀는지 확인
    api
      .get(`/api/posts/${props.postId}/isLikedByUser/${props.loginUser_no}`)
      .then((res) => setLiked(res.data.liked))
      .catch((err) => console.error(err));
  }, [props.postId, props.loginUser_no]);

  const handleLike = async () => {
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
      await api
        .post(`/api/posts/${props.postId}/unlike/${props.loginUser_no}`)
        .then(() => setLiked(false), setLike_count(like_count - 1))
        .catch((err) => console.error(err));
    } else {
      // 좋아요 등록
      await api
        .post(`/api/posts/${props.postId}/like`, {
          user_no: props.loginUser_no,
        })
        .then(
          () => setLiked(true),
          setLike_count(like_count + 1),
          //좋아요 시 알림 기능
          await createNotification(
            props.user_no,
            `${userInfo.nickname}님이 당신의 글을 좋아합니다.`,
            "new_heart"
          )
        )
        .catch((err) => console.error(err));
    }
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
        {isAbbreviated ? (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <span>{formatNumber(like_count)}</span>
          </OverlayTrigger>
        ) : (
          <span>{formatNumber(like_count)}</span>
        )}
      </div>
    </>
  );
}
export default Like;
