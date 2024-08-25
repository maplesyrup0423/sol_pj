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

/*
disabled: btnOn 가 true=활성화 || false=활성화

className : btnSize, btnColor 는 BasicButton.css 참고

onClick : action 은 버튼 클릭시 실행될 함수

btnText 는 버튼에 들어갈 텍스트
*/
/*
사용 예시 
<BasicButton
  btnOn={false}
  btnSize="mediumButton"
  btnColor="yellowButton"
  action={null}
  btnText="전송"
/>

*/
