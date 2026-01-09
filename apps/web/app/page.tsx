"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {

  const[roomId, setroomId] = useState('')
  const router = useRouter();

  return (
    <div >
      <input
       onChange={(e)=>{setroomId(e.target.value)}}
       type="text" 
       placeholder='roomId'/>

       <button onClick={()=>{ router.push(`/room/${roomId}`) }}>join room</button>

    </div>


  );
}
