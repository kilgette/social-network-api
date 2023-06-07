const { Users, Reactions, Thoughts } = require("../models");

module.exports = {
  fetchUsers(req, res) {
    Users.find()
      .populate(["thoughts", "friends"])
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  fetchSingleUser(req, res) {
    Users.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate(["thoughts", "friends"])
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err.message));
  },

  createUserRecord(req, res) {
    Users.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  updateUserRecord(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found with this ID" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteUserRecord(req, res) {
    Users.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found with this ID" })
          : res.json({ message: "User successfully deleted" })
      )
      .catch((err) => res.status(500).json(err));
  },

  addFriendConnection(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found with this ID" })
          : res.json({ message: "Friend connection successfully added" })
      )
      .catch((err) => res.status(500).json(err));
  },

  removeFriendConnection(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found with this ID" })
          : res.json({ message: "Friend connection successfully removed" })
      )
      .catch((err) => res.status(500).json(err));
  },
};