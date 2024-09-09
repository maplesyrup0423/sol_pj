import BasicButton from "../../../../utills/buttons/BasicButton";
import "./Room.css";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";
function Room() {
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, []); // 메시지가 추가될 때마다 실행되도록 할 수도 있음

    return (
        <>
            <div className="chatContainer">
                <div className="chat-Card ">
                    <ChatMessage
                        isMyChat={true}
                        text={
                            "내 채팅 다음줄 넘기기용 11111111111111111111111111111111111111"
                        }
                    />
                    <ChatMessage
                        isMyChat={false}
                        text={
                            "다른 사람의 채팅 다음줄 넘기기용 222222222222222222222222222"
                        }
                    />
                    <ChatMessage isMyChat={true} text={"내 채팅2"} />
                    <ChatMessage isMyChat={true} text={"내 채팅3"} />
                    <ChatMessage isMyChat={false} text={"다른 사람의 채팅2"} />
                    <div ref={chatEndRef} />
                </div>
                <form action="">
                    <div className="chat-input-box">
                        <input type="text" />
                    </div>
                    <BasicButton
                        btnSize={"mediumButton"}
                        btnText={"전송"}
                        btnColor={"yellowButton"}
                    />
                </form>
            </div>
        </>
    );
}

export default Room;
