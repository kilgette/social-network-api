const { Users, Reactions, Thoughts } = require("../models");

module.exports = {
  fetchThoughts(req, res) {
    Thoughts.find()
      .populate("reactions")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  fetchSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .populate("reactions")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err.message));
  },

  createNewThought(req, res) {
    Thoughts.create(req.body)
      .then((thought) => {
        return Users.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought created, but no user found with that ID",
            })
          : res.json("Thought successfully created")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateThoughtData(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteThoughtData(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json({ message: "Thought successfully deleted" })
      )
      .catch((err) => res.status(500).json(err));
  },

  addReactionToThought(req, res) {
    Reactions.create(req.body)
      .then((reaction) => {
        return Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: reaction._id } },
          { new: true }
        );
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json({ message: "Reaction successfully added" })
      )
      .catch((err) => res.status(500).json(err));
  },

  removeReactionFromThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: req.params.reactionId } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json({ message: "Reaction successfully removed" })
      )
      .catch((err) => res.status(500).json(err));
  },
};