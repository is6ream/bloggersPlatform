import { Document, Types, Schema } from "mongoose";

export interface BlogDocument extends Document {
  //описал то, что будет храниться в базе данных
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
}

const BlogsSchema = new Schema<BlogDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  isMembership: {
    type: Boolean,
    required: true,
  },
});

export const BlogModel = mongoose.model<BlogDocument>("blogs", BlogsSchema);
