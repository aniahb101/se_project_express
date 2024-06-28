const mongoose = require("mongoose");

const { Schema } = mongoose;
const validator = require("validator");

const { ObjectId } = Schema.Types;

const clothingItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;
