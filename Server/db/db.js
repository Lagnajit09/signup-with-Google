const mongoose = require("mongoose");

const federatedCredentialsSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  subject: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  federated_credentials: [federatedCredentialsSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
