import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
       await dbConnect();
       const videos = await Video.find({}).sort({createdAt: -1}).lean();
       if(!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
       }
       return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch videos: ${error}` }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const sesssion = await getServerSession(authOptions);
        if (!sesssion) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data:IVideo = await request.json();
        if (!data.title || !data.description || !data.videoUrl || !data.thumbnailUrl) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const videoData= {...data, controls: data.controls ?? true, transformation: {height: 1920, width: 1080, quality: data.transformation?.quality ?? 100} };
        const video = await Video.create(videoData);
        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create a video: ${error}` }, { status: 200 });
    }
}