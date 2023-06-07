const { Schema, model } = require("mongoose");

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^([a-z0-9]+)@([da-z]+).([a-z]{2,6})$/,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thoughts",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

usersSchema.virtual("friendCount").get(function () {
  if (this.friends.length > 0) {
    return this.friends.length;
  }
});

const UsersModel = model("Users", usersSchema);

module.exports = UsersModel;