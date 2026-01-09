import { useEffect, useState } from "react"
import { WS_URL } from "../app/config";

export function useSocket(){
    const[loading, setloading] = useState(true)
    const[socket, setsocket] = useState<WebSocket>()

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}`);
        // for testing use below because we have to give websocket url a token for verification so we hard coded it 
        
        // const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAxY2VlOS0yNDI3LVjZi1hYmNiNjQzOGY3NmUiLCJpYXQiOjE3Njc5NTYyODB9.J0VWY-6p8sSotN18HjKQIpnFovMR4K1DOUag95v8IdY`);
        ws.onopen = () => {
            setloading(false)
            setsocket(ws)
        }
    },[])

    return {
        socket,
        loading
    }
}