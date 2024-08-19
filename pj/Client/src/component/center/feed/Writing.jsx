import React from "react";
import ProfileImg from "../../publicComponent/ProfileImg";
import "./Writing.css";
import BasicButton from "../../publicComponent/BasicButton";
function Writing() {
  return (
    <div className="writingArea">
      <table className="Wtable">
        <tbody>
          <tr>
            <td className="ProfileImg">
              <ProfileImg />
            </td>
            <td className="">
              <textarea
                name="postContent"
                rows={4}
                cols={40}
                placeholder="글을 작성해주세요."
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

      {/* 참고 : https://ko.react.dev/reference/react-dom/components/textarea */}
    </div>
  );
}
export default Writing;
