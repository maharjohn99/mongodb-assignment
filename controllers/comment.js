// utils
import makeValidation from '@withvoid/make-validation';
// models
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import CommentModel from '../models/Comment.js';

export default {
 
onCreateComment: async (req, res) => {
    try {
    const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          comment: { type: types.string },
        }
      }));

      if (!validation.success) return res.status(400).json({ ...validation });

      const comment = req.body.comment;
      const user = await UserModel.getUserById(req.userId);
      const commentedBy = user.firstName + ' ' + user.lastName;
      const {postId} = req.params;
      const comments = await CommentModel.createComment(comment, commentedBy, postId);
     
      return res.status(200).json({ success: true, comments });
    } catch (error) {

      return res.status(500).json({ success: false, error: error })
    }
  },

}
