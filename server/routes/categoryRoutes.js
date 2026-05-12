const express = require("express")
const router = express.Router()

const Category = require("../models/Category")
const Task = require("../models/Task")

// GET categories
// GET categories
router.get("/", async (req, res) => {

  const categories = await Category.find({
    userId: req.query.userId
  })

  res.json(categories)
})

// ADD category
// ADD category
router.post("/", async (req, res) => {

  const newCategory = new Category({
    userId: req.body.userId,
    name: req.body.name
  })

  await newCategory.save()

  res.json(newCategory)
})

// DELETE category and tasks
router.delete("/:id", async (req, res) => {

  await Category.findByIdAndDelete(req.params.id)

  await Task.deleteMany({
    categoryId: req.params.id
  })

  res.json({
    message: "Category deleted"
  })
})

module.exports = router