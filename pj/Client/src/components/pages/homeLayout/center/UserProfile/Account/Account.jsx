import "./Account.css";
import { useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { IoIosArrowForward } from "react-icons/io";
import { LuKeyRound } from "react-icons/lu";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

function Account() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  return (
    <>
      <div className="Account-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>계정관리</span>
      </div>
      <div className="Account-body">
        <ul>
          <li>
            <NavLink to={``} className="Account-NavLink">
              <div className="Account-btn">
                <div className="Account-left">
                  <VscAccount color="gray" size={25} />
                  <div className="Account-text">
                    <p>계정정보</p>
                    <p className="Account-gray-text">계정정보를 조회합니다.</p>
                  </div>
                </div>
                <IoIosArrowForward color="gray" size={25} />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={"/ChangePassword"} className="Account-NavLink">
              <div className="Account-btn">
                <div className="Account-left">
                  <LuKeyRound color="gray" size={25} />
                  <div className="Account-text">
                    <p>비밀번호 변경</p>
                    <p className="Account-gray-text">비밀번호를 변경합니다.</p>
                  </div>
                </div>
                <IoIosArrowForward color="gray" size={25} />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={``} className="Account-NavLink">
              <div className="Account-btn">
                <div className="Account-left">
                  <MdOutlineSwitchAccount color="gray" size={25} />
                  <div className="Account-text">
                    <p>로그인 기록 조회</p>
                    <p className="Account-gray-text">
                      로그인한 기록을 조회합니다.
                    </p>
                  </div>
                </div>
                <IoIosArrowForward color="gray" size={25} />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={``} className="Account-NavLink">
              <div className="Account-btn">
                <div className="Account-left">
                  <TiDeleteOutline color="gray" size={25} />
                  <div className="Account-text">
                    <p>계정 비활성화</p>
                    <p className="Account-gray-text">계정을 비활성화 합니다.</p>
                  </div>
                </div>
                <IoIosArrowForward color="gray" size={25} />
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
export default Account;
