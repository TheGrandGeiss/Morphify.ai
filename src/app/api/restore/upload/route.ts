'use server';

import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import connectDB from '@/db/mongodb';
import { auth } from '@/auth';
import { imageModel, users } from '@/db/schema';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'Sign In son' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'Please Provide File' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.v2.uploader.upload(base64Image, {
      folder: 'uploads',
      transformation: [
        { quality: 'auto:best' }, // Selects best quality
        { effect: 'sharpen' }, // Sharpens details
        { effect: 'enhance' }, // Improves overall look
        { format: 'auto' },
      ],
    });

    await connectDB();
    const storedImage = new imageModel({
      imageUrl: result.secure_url,
      title,
      original: result.secure_url,
      uploadedBy: session.user?.name,
      uploadedByEmail: session.user?.email,
      edit: 'restore',
      name: session.user?.name,
    });

    await users.findOneAndUpdate(
      { email: session.user?.email }, // Find the user by email
      {
        $push: {
          image: {
            id: result.public_id,
            title: title,
            url: result.secure_url,
            uploadedAt: new Date(),
            edit: 'restore',
          },
        },
      },
      { new: true },
    );
    await storedImage.save();

    return NextResponse.json(
      { message: 'Upload Successful', url: result },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Error: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: error }, { status: 500 });
  }
}
