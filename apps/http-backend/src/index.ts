import express from 'express';
import jwt from 'jsonwebtoken';
// import (CreateUserSchema) from '@repo/commom/types';
import { CreateUserSchema, CreateSigninSchema, CreateRoomSchema } from '@repo/common/types'
import { prisma } from '@repo/db/prisma';

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
    } catch(e) {
        console.log(e); 
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post('./signin', (req, res) => {
    const user = CreateSigninSchema.safeParse(req.body);
    if (!user.success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        })
    }

    res.json({
        message: "signin succesfull"
    })
})

app.post('/room', (req, res) => {
    const room = CreateRoomSchema.safeParse(req.body)
    if (!room.success) {
        return res.status(400).json({
            message: "invalid Inputes"
        })
    }

    res.json({
        message: "room created succesfully"
    })
})



app.listen(3001)