import { NextResponse } from "next/server";
import { hasDbConfig } from "@/lib/db";
import { hasCloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  return NextResponse.json({
    db: hasDbConfig(),
    cloudinary: hasCloudinaryConfig(),
    mode: hasDbConfig() ? "server" : "demo",
  });
}
