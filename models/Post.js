import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from '../models/User.js';
const CONTENT_TYPES = {
  TYPE_TEXT: "text",
};

const GeoSchema = mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number], 
    
  },
  _id:false,
 
    timestamps: false,
  
})
const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    content: String,
    postedByUser: String,
    address: String,
    location:GeoSchema

  },
  {
    timestamps: true,
    collection: "posts",
  }
);

 postSchema.statics.createPost = async function (content, postedByUser, address,location) {
    try {
      const post = await this.create({ content, postedByUser,address, location });
      return post;
    } catch (error) {
      throw error;
    }
  }

  postSchema.statics.getPostByNearest = async function (id) {
    try {
     const user = await UserModel.getUserById(id);
      if (!user) throw ({ error: 'No user with this id found' });
      return this.find(
        {
           "location": {
             $near: {
               $geometry: {
                  type: "Point" ,
                  coordinates: user.location.coordinates
               },
             }
           }
        }
        ) ;
    } catch (error) {
      throw error;
    }
  }

  postSchema.statics.getPostsWithComments = async function () {
    try {
      return this.aggregate([
         {
          $lookup:
          {
            from:"users",
            let:{userId:"$postedByUser"},
            pipeline:[
              { $match:
                { $expr:
                 {  $and:
                    [
                      {$eq:["$_id","$$userId"]}
                    ]
                  }
                }
              },
          ],
          as:"postedBy"
        }
      },
      {
        $lookup:
              {
                from:"comments",
                let:{post_id:"$_id"},
                pipeline:[
                  { $match:
                    { $expr:
                     {  $and:
                        [
                          {$eq:["$postId","$$post_id"]}
                        ]
                      }
                    }
                  },
                  {$sort: {"createdAt":-1},
                  },
                   { $limit: 3 },
                    ],
                 as:"comments"
               }  
      }
      ]);
    } catch (error) {
      throw error;
    }
  }

  postSchema.statics.deletePostById = async function (id) {
    try {
      const result = await this.remove({ postedByUser: id });
      return result;
    } catch (error) {
      throw "you cannot delete others post";
    }
  }

export default mongoose.model("Post", postSchema);
