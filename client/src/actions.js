import axios from "./axios";

export async function receiveConnectionsWannabes() {
    const { data } = await axios.get("/connections-wannabes");
    console.log("Connections: ", data);
    if (data.success) {
        return {
            type: "RECEIVE_CONNECTIONS_WANNABES",
            connectionsWannabes: data.connectionsWannabes,
        };
    }
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post(`/add-friendship/${id}`);
    if (data.success) {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id,
        };
    }
}

export async function unfriend(id) {
    const { data } = await axios.post(`/end-friendship/${id}`);
    if (data.success) {
        return {
            type: "UNFRIEND",
            id,
        };
    }
}

export function chatMessages(messages) {
    // console.log("Messages in action.js:", msgs);
    return {
        type: "RECENT_MESSAGES",
        messages: messages,
    };
}

export function chatMessage(message) {
    // console.log("action dispatch from socket for new chat message!");
    return {
        type: "NEW_MESSAGE",
        message: message,
    };
}
