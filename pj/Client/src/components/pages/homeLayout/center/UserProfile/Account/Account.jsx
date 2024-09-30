import "./Account.css";
import { useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { IoIosArrowForward } from "react-icons/io";
import { LuKeyRound } from "react-icons/lu";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

function Account() {
    const menuItems = [
        {
            title: "계정정보",
            description: "계정정보를 조회합니다.",
            icon: <VscAccount color="gray" size={25} />,
            path: "",
        },
        {
            title: "비밀번호 변경",
            description: "비밀번호를 변경합니다.",
            icon: <LuKeyRound color="gray" size={25} />,
            path: "/ChangePassword",
        },
        {
            title: "로그인 기록 조회",
            description: "로그인한 기록을 조회합니다.",
            icon: <MdOutlineSwitchAccount color="gray" size={25} />,
            path: "/LoginHistory",
        },
        {
            title: "계정 비활성화",
            description: "계정을 비활성화 합니다.",
            icon: <TiDeleteOutline color="gray" size={25} />,
            path: "/DeactivateAccount",
        },
    ];
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
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <NavLink to={item.path} className="Account-NavLink">
                                <div className="Account-btn">
                                    <div className="Account-left">
                                        {item.icon}
                                        <div className="Account-text">
                                            <p>{item.title}</p>
                                            <p className="Account-gray-text">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward color="gray" size={25} />
                                </div>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Account;
