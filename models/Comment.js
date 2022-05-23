import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const commentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    comment: String,
    commentedBy: String,
    postId: String,
  },
  {
    timestamps: true,
    collection: "comments",
  }
);
 commentSchema.statics.createComment = async function (comment, commentedBy, postId) {
    try {
      const comments = await this.create({ comment, commentedBy, postId });
      return comments;
    } catch (error) {
      throw error;
    }
  }
export default mongoose.model("Comment", commentSchema);
