import { Backend_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string){
    const response = await fetch(`${Backend_URL}/chat/${roomId}`) 
    const data = await response.json()
    console.log( "++++++++++++++++++++++++++++",data.messages)
    return data.messages
}

export async function ChatRoom({id}: {
    id: string
}){
    const messages = await getChats(id);

    return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>
}