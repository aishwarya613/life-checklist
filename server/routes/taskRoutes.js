const express = require("express")
const router = express.Router()

const Task = require("../models/Task")

// GET tasks by category
router.get("/:categoryId", async (req, res) => {

  const tasks = await Task.find({
    categoryId: req.params.categoryId,
    userId: req.query.userId
  })

  res.json(tasks)
})


// ADD task
router.post("/", async (req, res) => {

  const newTask = new Task({
    userId: req.body.userId,
    categoryId: req.body.categoryId,
    title: req.body.title
  })

  await newTask.save()

  res.json(newTask)
})


// TOGGLE complete
router.put("/:id", async (req, res) => {

  const task = await Task.findById(req.params.id)

  task.completed = !task.completed

  await task.save()

  res.json(task)
})
// DELETE task
router.delete("/:id", async (req, res) => {

  await Task.findByIdAndDelete(req.params.id)

  res.json({
    message: "Task deleted"
  })
})
module.exports = router