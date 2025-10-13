import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import type { User } from "next-auth";

async function ensureUser(sessionUser: User | null) {
  if (!sessionUser?.email) return null;


  let user = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });


  if (!user) {
    user = await prisma.user.create({
      data: {
        email: sessionUser.email,
        name: sessionUser.name || "Anonymous",
        image: sessionUser.image || null,
        createdAt: new Date(),
      },
    });
  } else if (!user.createdAt) {

    user = await prisma.user.update({
      where: { email: sessionUser.email },
      data: { createdAt: new Date() },
    });
  }

  return user;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    const user = await ensureUser(session.user);
    if (!user) return NextResponse.json([], { status: 200 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(favorites);
  } catch (err) {
    console.error("❌ GET /favorites error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await req.json();
    if (!movieId) {
      return NextResponse.json({ error: "Missing movieId" }, { status: 400 });
    }

    const user = await ensureUser(session.user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const existing = await prisma.favorite.findFirst({
      where: { userId: user.id, movieId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: "Removed" }, { status: 200 });
    } else {
      const favorite = await prisma.favorite.create({
        data: { userId: user.id, movieId },
      });
      return NextResponse.json(favorite, { status: 200 });
    }
  } catch (err) {
    console.error("❌ POST /favorites error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
