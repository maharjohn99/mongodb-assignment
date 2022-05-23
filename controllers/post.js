// utils
import makeValidation from '@withvoid/make-validation';
// models
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export default {
  onGetAllPosts: async (req, res) => {
    try {
      const posts = await PostModel.getPostsWithComments();
      return res.status(200).json({ success: true, posts });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onGetPostByNearest: async (req, res) => {
    try {
      const nearestPost = await PostModel.getPostByNearest(req.userId);
      return res.status(200).json({ success: true, nearestPost });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
onCreatePost: async (req, res) => {
    try {
     
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          content: { type: types.string },
      

        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const content = req.body.content;
      const address = req.body.address;
      const location = req.body.location;
      const postedByUser = req.userId;
      const post = await PostModel.createPost(content,  postedByUser, address, location);
     
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onDeletePostById: async (req, res) => {
    try {
      
      const post = await PostModel.deletePostById(req.userId);
      return res.status(200).json({ 
        success: true, 
        message: `Deleted a count of ${post.deletedCount} post.` 
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Cannot delete a post' })
    }
  },
}
