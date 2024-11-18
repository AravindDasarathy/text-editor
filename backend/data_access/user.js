import { User } from '../models/User.js';

const getUserByEmailFromDb = (email) => User.findOne({ email });

const createUserInDb = (user) => new User(user).save();

const findUserByIdFromDb = (userId) => User.findById(userId);

const updateUserDb = (user, update) => User.updateOne(
  { _id: user._id },
  { $set: update }
);

export {
  getUserByEmailFromDb,
  createUserInDb,
  findUserByIdFromDb,
  updateUserDb
};