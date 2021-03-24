import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    // console.log("chatMessages", chatMessages);

    const socket = io.connect();
    const elemRef = useRef();

    let chatMsg = "";

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log("new scrollTop:", elemRef.current.scrollTop);
    }, [chatMessages]);

    function sendChatMsg(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            chatMsg = e.target.value;
            console.log("New chat:", chatMsg);
            e.target.value = "";
            socket.emit("chatMessage", chatMsg);
        }
    }

    return (
        <>
            <h1 className="chatTitle">Agora</h1>
            <h3 className="chatTitle">
                Communicate with the whole network of creators
            </h3>
            <div id="chat-top-container">
                <div id="chat-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map(function (user_msg) {
                            return (
                                <div className="chat-block" key={user_msg.id}>
                                    <img
                                        className="chat-pic"
                                        src={user_msg.image_url}
                                    ></img>
                                    <div className="chat-details">
                                        <h4 className="chat-time">
                                            {user_msg.first} {user_msg.last} at{" "}
                                            {new Date(
                                                user_msg.sent_at
                                            ).toLocaleString()}
                                        </h4>
                                        <p className="chat-msg">
                                            {user_msg.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea
                    id="chat-msg-editor"
                    onKeyDown={sendChatMsg}
                    placeholder="Write your message here..."
                ></textarea>
            </div>
        </>
    );
}
