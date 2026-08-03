import { NextResponse } from "next/server";
import { hasMongoConfig } from "@/lib/db";
import { hasCloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  return NextResponse.json({
    mongo: hasMongoConfig(),
    cloudinary: hasCloudinaryConfig(),
    mode: hasMongoConfig() ? "server" : "demo",
  });
}
