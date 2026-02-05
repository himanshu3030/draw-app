"use client"

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "@/config";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setsocket] = useState<WebSocket | null>(null);
  console.log("room canvas roomId : ", roomId)
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMGU4MWRkYy0wZjdjLTQ0NDYtOWE0ZS1hZGU5M2UyMWI5NmUiLCJpYXQiOjE3NzAyMjQxNzd9.5qKCQnELulYQw5yml4LRnGbVnhx7Ta0MpMHeoux4Pco`)
    ws.onopen = () => {
      setsocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId
      })
      ws.send(data)
    }

  }, [])

  if (!socket) {
    return <div>
      connecting with websocket......
    </div>
  }

  return (

    <Canvas roomId={roomId} socket={socket} />

  )
}