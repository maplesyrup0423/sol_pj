import "./Policy.css";
import "./DeveloperInfo.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function DeveloperInfo() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  const developers = [
    {
      name: "김한결",
      email: "",
      github: "https://github.com/",
    },
    {
      name: "맹일진",
      email: "",
      github: "https://github.com/",
    },
    {
      name: "박주영",
      email: "",
      github: "https://github.com/",
    },
    {
      name: "임예진",
      email: "maplesyrup0423@naver.com",
      github: "https://github.com/maplesyrup0423",
    },
    {
      name: "임요한",
      email: "",
      github: "https://github.com/",
    },
  ];
  return (
    <>
      <div className="Policy-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>개발자 정보</span>
      </div>
      <div className="developer-info">
        <ul>
          {developers.map((developer, index) => (
            <li key={index} className="developer-card">
              <h3>{developer.name}</h3>
              <p>
                <strong>이메일:</strong> {developer.email}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {developer.github}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default DeveloperInfo;
