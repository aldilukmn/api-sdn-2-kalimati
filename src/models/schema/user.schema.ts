import mongoose, { Schema } from "mongoose";
import User from "../entity/user.entity";

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    role: {
      type: String,
      require: true
    },
    grade: {
      type: String,
      default: null,
    },
    //   image_url: {
    //     type: String,
    //     require: true
    // },
    //   image_id: {
    //     type: String,
    //     require: true
    //   }
  },
  {
    collection: 'user',
    timestamps: true
  }
);

const UserModel = mongoose.model<User>('user', UserSchema);

export default UserModel;