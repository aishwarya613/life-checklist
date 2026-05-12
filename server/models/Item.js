const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  title: {
    type: String,
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("Item", ItemSchema)