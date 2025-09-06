
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get pagination params
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "30";

  const res = await fetch(`https://api.github.com/user/repos?page=${page}&per_page=${per_page}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: res.status });
  }

  const repos = await res.json();
  return NextResponse.json(repos);
}
