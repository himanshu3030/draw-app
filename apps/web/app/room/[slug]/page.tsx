import { ChatRoom } from "../../../components/ChatRoom"
import { Backend_URL } from "../../config"

async function getRoomId(slug: string){
       const response = await fetch(`${Backend_URL}/room/${slug}`)
    //    const response = await fetch(`http://localhost:3001/room/${slug}`)
       const data = await response.json()
       return data.room.id

}

export default async function ChatRoom1({
    params
}:{
    params: {
        slug:string
    }
}){
    // below line can also be writen as 
    // const slug = (await params).slug;
    const {slug} = await params;
    const roomId = await getRoomId(slug);
    console.log("******** ", roomId)

    return <ChatRoom id={roomId}></ChatRoom>
}