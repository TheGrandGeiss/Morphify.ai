import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    profile: String,
    image: [
      {
        id: String,
        title: String,
        url: String,
        uploadedAt: Date,
        edit: String,
      },
    ],
  },
  { timestamps: true },
);
const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  original: { type: String, required: true },
  prompt: { type: String, required: false },
  name: {
    type: String,
    required: true,
  },
  edit: {
    type: String,

    required: true,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  uploadedByEmail: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const users = mongoose.models.User || mongoose.model('User', userSchema);
const imageModel =
  mongoose.models.Image || mongoose.model('Image', ImageSchema);

export { users, imageModel };
