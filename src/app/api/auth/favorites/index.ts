import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const favorites = await prisma.favorite.findMany({ where: { userId: user.id } });
    return res.status(200).json(favorites);
  }

  if (req.method === "POST") {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ error: "movieId required" });

    const exists = await prisma.favorite.findFirst({
      where: { userId: user.id, movieId },
    });

    if (exists) {
      await prisma.favorite.delete({ where: { id: exists.id } });
      return res.status(200).json({ message: "Removed from favorites" });
    } else {
      const favorite = await prisma.favorite.create({
        data: { userId: user.id, movieId },
      });
      return res.status(201).json(favorite);
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
