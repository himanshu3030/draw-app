import { RoomCanvas } from "@/components/RoomCanvas";


export default async function CanvasPage({params}:{
  params: {
    roomId: string
  }
}) {    

  const id = await params;
  const roomId = id.roomId
  console.log("this is room id : ", roomId);
 return <RoomCanvas roomId={roomId}/>
}