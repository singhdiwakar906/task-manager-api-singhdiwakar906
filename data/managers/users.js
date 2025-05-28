const userModel = require('../models/userModel');
const utils = require('../../utils');

// Get single user details
module.exports.getUserDetails = async (searchQuery) => {
  try {
    const user = await userModel.findOne(searchQuery);
    return user;
  } catch (err) {
    throw new Error(`Error while getting user details: ${err.message}`);
  }
};

// Create a new user
module.exports.createProfile = async (payload) => {
  try {
    const user = await userModel.create(payload);
    return user;
  } catch (err) {
    throw new Error(`Error while creating user: ${err.message}`);
  }
};