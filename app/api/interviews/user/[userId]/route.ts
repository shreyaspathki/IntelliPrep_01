import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const interviewsRef = db.collection("interviews");
    const snapshot = await interviewsRef
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const interviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
