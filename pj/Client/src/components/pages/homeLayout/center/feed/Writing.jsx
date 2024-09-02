import ProfileImg from "../../../../utills/ProfileImg";
import "./Writing.css";
import BasicButton from "../../../../utills/buttons/BasicButton";
function Writing({ userInfo, boardId }) {
  return (
    <div className="writingArea">
      <table className="Wtable">
        <tbody>
          <tr>
            <td className="ProfileImg">
              <ProfileImg image_url={userInfo.image_url} />
            </td>
            <td className="">
              <textarea
                name="postContent"
                rows={4}
                cols={40}
                placeholder={`게시판 아이디 : ${boardId} || 글을 작성해주세요.`}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="btn">
              {/* 버튼 */}
              <BasicButton
                btnOn={false}
                btnSize="mediumButton"
                btnColor="yellowButton"
                action={null}
                btnText="전송"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Writing;
