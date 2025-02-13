import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
            
        }
        await dbConnect();
        const user = await User.findOne({ email });
        if (user) {        
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        await User.create({ email, password });
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
    
}