import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import (CreateUserSchema) from '@repo/commom/types';
import { CreateUserSchema, CreateSigninSchema, CreateRoomSchema } from '@repo/common/types'
import { prisma } from '@repo/db/prisma';
import { JWT_SECRET } from '@repo/backend-common/config'
import { authMiddleware } from "./middleware.js"

const app = express();
app.use(express.json())


app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                // @ts-ignore
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch (e) {
        console.log(e);
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post('/signin', async (req, res) => {
    const parsedData = CreateSigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })
    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET)

    res.json({
        message: "signin succesfull",
        token: token
    })
})

app.post('/room', authMiddleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(400).json({
            message: "invalid Inputes"
        })
    }
    try {
        // @ts-ignore
        const userId = req.userId
        const roomName = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        res.json({
            message: "room created succesfully",
            roomname: roomName.slug
        })
    } catch (e) {
        return res.status(411).json({
            message: "Room already exists with this name"
        })
    }

})

app.get("/chat/:roomId", async (req, res) => {

    try {
        const roomId = Number(req.params.roomId)
    const messages = await prisma.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    res.json({
        messages: messages
    })
    } catch (e) {
        res.json({
            messages: []
        })
    }
})

app.get('/room/:slug', async (req, res) => {
    try{
 const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    })
    res.json({
        room
    })
    } catch(e){
        res.json({
            e
        })
    }
   
})


app.listen(3001)