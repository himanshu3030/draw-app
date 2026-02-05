"use client"
import { initDraw } from "@/draw";
import { useRef, useEffect } from "react";

export function Canvas({
    roomId,
    socket
}: {
    roomId: string,
    socket: WebSocket
}){
     const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {

    const canvas = canvasRef.current;
    console.log(canvas)

    if(canvas){
      initDraw(canvas, roomId, socket)
    }

  }, [canvasRef])

  return (

    <canvas ref={canvasRef} width={1820} height={1000} style={{ border: "1px solid black" }}></canvas>

  )
}