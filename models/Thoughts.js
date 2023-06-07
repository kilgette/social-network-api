const mongoose = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtsSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 240,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
});

thoughtsSchema.virtual('reactionCount').get(function () {
  return ${ this.reactions.length };
});

const ThoughtsModel = mongoose.model('Thoughts', thoughtsSchema);
module.exports = ThoughtsModel;