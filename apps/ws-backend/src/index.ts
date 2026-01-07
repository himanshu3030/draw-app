import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prisma } from "@repo/db/prisma"

const wss = new WebSocketServer({port: 8080})

interface User {
    userId: string,
    rooms: string[],
    ws: WebSocket
}

const users: User[] = [];

function checkAuth(token: string, JWT_SECRET: string): string | null{
   try{
       const decoded = jwt.verify(token, JWT_SECRET);

       if(typeof decoded === 'string'){
        return null
       }
       if(!decoded || !decoded.userId){
        return null;
       }

       return decoded.userId

   }catch(e){
         return null;
   }

}

wss.on('connection', function connsection(ws, request){
    const url = request.url;
    if(!url){
        return;
    }

    const quearyParams = new URLSearchParams(url.split('?')[1]);
    const token = quearyParams.get('token') || '';
    const userId = checkAuth(token, JWT_SECRET);

    if(userId == null){
        ws.close();
        return null;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })


    ws.on('message', async function message(data){
        // methot 1st to get ridoff the type error
        let parsedData
        if(typeof(data) !== "string"){
           parsedData = JSON.parse(data.toString())
        }else{
            parsedData = JSON.parse(data)  // like {type: 'join_room', roomId: "1"}
        }
      
        // method 2 
        // const parsedData = JSON.parse(data as unknown as string) // like {type: 'join_room', roomId: "1"}
         
        if(parsedData.type === "join_room"){
            const user = users.find(x=> x.ws === ws)
            user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type === "leave_room"){
            const user = users.find(x=> x.ws === ws)
            if(!user){
                return; 
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room)
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prisma.chat.create({
                data: {
                    roomId: Number(roomId),
                    message,
                    userId
                }
            })

            users.forEach(user =>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId
                }))
                }
            })
        }


        
    });

    
});