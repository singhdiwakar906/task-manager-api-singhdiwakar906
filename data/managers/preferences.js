const preferencesModal = require('../models/preferenceModel');
const utils = require('../../utils');

module.exports.createUserPreferences = async (payload) => {
  try {
    const preferences = await preferencesModal.create(payload)
    return preferences;
  } catch (err) {
    throw new Error(`Error while getting user preferences: ${err.message}`);
  }
};

module.exports.getUserPreferences = async (searchQuery) => {
  try {
    const preferences = await preferencesModal.findOne(searchQuery);
    return preferences;
  } catch (err) {
    throw new Error(`Error while getting user preferences: ${err.message}`);
  }
};

module.exports.updateUserPreferences = async (searchQuery, payload) => {
  try {
    const preferences = await preferencesModal.findOneAndUpdate(
      searchQuery,
      { $set: payload },
      { new: true, upsert: true }
    );
    return preferences;
  } catch (err) {
    throw new Error(`Error while updating preferences: ${err.message}`);
  }
};