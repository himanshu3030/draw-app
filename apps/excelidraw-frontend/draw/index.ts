import { BACKEND_URL } from "@/config"
import axios from "axios"

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}

export async function initDraw(canvas: HTMLCanvasElement, room_Id:string, socket: WebSocket) {
    const ctx = canvas.getContext("2d")

    let existingShape: Shape[] = await fetchingExistingShapes(room_Id)

    if (ctx === null) {
        return
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if(message.type === 'chat'){
            const parsedMessage = JSON.parse(message.message)
            existingShape.push(parsedMessage.shape)
            displayShapes(existingShape, ctx, canvas)
        }
    }

    displayShapes(existingShape, ctx, canvas)
    let startx = 0
    let starty = 0
    let clicked = false;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true

        startx = e.clientX
        starty = e.clientY
        // console.log("mousedown-x ", e.clientX)
        // console.log("mousedown-y ", e.clientY)
    })
    canvas.addEventListener('mouseup', (e) => {
        clicked = false
        const width = e.clientX - startx
        const height = e.clientY - starty
        const shape: Shape = {
             type: "rect",
            x: startx,
            y: starty,
            width: width,
            height: height
        }
        existingShape.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            room_Id
        }))

    })
    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startx
            const height = e.clientY - starty
            displayShapes(existingShape, ctx, canvas)
            ctx.strokeStyle = "white"
            // ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
            ctx.strokeRect(startx, starty, width, height)
            // console.log('mousemove-x ', e.clientX)
            // console.log('mousemove-y ', e.clientY)
        }
    })
}
function displayShapes(existingShape: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement,) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0, 0, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    console.log(existingShape)

    existingShape.forEach((s) => {
        if (s.type === 'rect') {
            ctx.strokeStyle = "white"
            ctx.strokeRect(s.x, s.y, s.width, s.height)
        }
    })
}

async function fetchingExistingShapes(room_Id: string) {
    const res = await axios.get(`${BACKEND_URL}/chat/${room_Id}`)
   const messages = res.data.messages || res.data.message || []

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape
    })

    return shapes

}



