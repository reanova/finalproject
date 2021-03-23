import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
// import { io } from "socket.io-client";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("chatMessages", chatMessages);
    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    function sendMsg(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("Message: ", e.target.value);
            const dataToEmit = {
                message: e.target.value,
            };
            socket.emit("chatMessage", dataToEmit);
            e.target.value = "";
        }
    }
