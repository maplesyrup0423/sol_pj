import React from "react";
import "./BasicButton.css";

const BasicButton = ({ btnOn, btnSize, btnColor, btnText, action }) => {
  return (
    <button
      onClick={action}
      disabled={btnOn} // disabled 속성은 true/false로 제어됩니다.
      className={`${btnSize}  ${btnColor}`}
    >
      {btnText}
    </button>
  );
};

export default BasicButton;
