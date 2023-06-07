const { Schema, model } = require("mongoose");

const reactionsSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: getCurrentDate,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

function getCurrentDate() {
  return Date.now;
}

const ReactionsModel = model("Reactions", reactionsSchema);

module.exports = ReactionsModel;




