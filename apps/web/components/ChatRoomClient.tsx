'use client';

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}:{
    messages: {message: string}[],
    id: string
}){
    const[currentmessage, setcurrentmessage] = useState('')
    const[chats, setchats] = useState(messages)
    const {socket, loading} = useSocket()

    useEffect(()=>{
           if(socket && !loading){

            socket.send(JSON.stringify({
                type: 'join_room',
                roomId: id
            }))

            socket.onmessage=(event)=>{
               const parsedData = JSON.parse(event.data)
               if(parsedData.type === 'chat'){
                   setchats(c => [...c, {message: parsedData.message}])
               }
            }
           }
    },[socket, loading, id])

    return(
        <div>
            {chats.map((m,i) => <div key={i}>{m.message}</div>)}

            <input 
            onChange={(e)=>{setcurrentmessage(e.target.value)}}
            type="text" placeholder="start chating..."/>

            <button onClick={()=>{
                socket?.send(JSON.stringify({
                    type: 'chat',
                    roomId: id,
                    message: currentmessage
                }))
                setcurrentmessage('')
            }}>send message</button>
        </div>
    )
}