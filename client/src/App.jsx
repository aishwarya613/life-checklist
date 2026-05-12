import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  // AUTH STATES
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // APP STATES
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [tasks, setTasks] = useState({})
  const [taskInputs, setTaskInputs] = useState({})

  // Check login on refresh
  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {
      setIsLoggedIn(true)
      fetchCategories()
    }

  }, [])

  // REGISTER
  const register = async () => {

    try {

      await axios.post(
        "http://localhost:5000/auth/register",
        {
          email,
          password
        }
      )

      alert("Registration successful!")

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration failed"
      )
    }
  }

  // LOGIN
  const login = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password
        }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.userId)

      setIsLoggedIn(true)

      fetchCategories()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      )
    }
  }

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    setIsLoggedIn(false)
  }

  // Fetch categories
  const fetchCategories = async () => {

  const userId = localStorage.getItem("userId")

  const res = await axios.get(
    `http://localhost:5000/categories?userId=${userId}`
  )

  setCategories(res.data)

  res.data.forEach((category) => {
    fetchTasks(category._id)
  })
}

  // Fetch tasks
  const fetchTasks = async (categoryId) => {

  const userId = localStorage.getItem("userId")

  const res = await axios.get(
    `http://localhost:5000/tasks/${categoryId}?userId=${userId}`
  )

  setTasks(prev => ({
    ...prev,
    [categoryId]: res.data
  }))
}

  // Add category
  const addCategory = async () => {

  if (!newCategory.trim()) return

  const userId = localStorage.getItem("userId")

  await axios.post(
    "http://localhost:5000/categories",
    {
      userId,
      name: newCategory
    }
  )

  setNewCategory("")
  fetchCategories()
}
  // Delete category
  const deleteCategory = async (categoryId) => {

    await axios.delete(
      `http://localhost:5000/categories/${categoryId}`
    )

    fetchCategories()
  }

  // Add task
  const addTask = async (categoryId) => {

  const title = taskInputs[categoryId]

  if (!title?.trim()) return

  const userId = localStorage.getItem("userId")

  await axios.post(
    "http://localhost:5000/tasks",
    {
      userId,
      categoryId,
      title
    }
  )

  setTaskInputs(prev => ({
    ...prev,
    [categoryId]: ""
  }))

  fetchTasks(categoryId)
}
  // Toggle task
  const toggleTask = async (taskId, categoryId) => {

    await axios.put(
      `http://localhost:5000/tasks/${taskId}`
    )

    fetchTasks(categoryId)
  }

  // Delete task
  const deleteTask = async (taskId, categoryId) => {

    await axios.delete(
      `http://localhost:5000/tasks/${taskId}`
    )

    fetchTasks(categoryId)
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {

    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">

        <div className="bg-zinc-800 p-10 rounded-2xl w-96">

          <h1 className="text-4xl font-bold mb-8 text-center">
            Life Checklist
          </h1>

          <div className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              className="bg-zinc-700 px-4 py-3 rounded-lg outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="bg-zinc-700 px-4 py-3 rounded-lg outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={register}
              className="bg-green-600 py-3 rounded-lg hover:bg-green-700"
            >
              Register
            </button>

            <button
              onClick={login}
              className="bg-blue-600 py-3 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>

          </div>

        </div>

      </div>
    )
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">

        <h1 className="text-5xl font-bold">
          Life Checklist
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

      {/* Add Category */}
      <div className="flex gap-4 mb-10">

        <input
          type="text"
          placeholder="New category"
          className="bg-zinc-800 px-4 py-3 rounded-lg outline-none w-80"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <button
          onClick={addCategory}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Add Category
        </button>

      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {categories.map((category) => {

          const categoryTasks =
            tasks[category._id] || []

          const completedTasks =
            categoryTasks.filter(
              (task) => task.completed
            ).length

          const totalTasks =
            categoryTasks.length

          const percentage =
            totalTasks === 0
              ? 0
              : Math.round(
                  (completedTasks / totalTasks) * 100
                )

          return (

            <div
              key={category._id}
              className="bg-zinc-800 p-6 rounded-2xl shadow-lg"
            >

              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">

                <h2 className="text-2xl font-bold capitalize">
                  {category.name}
                </h2>

                <button
                  onClick={() =>
                    deleteCategory(category._id)
                  }
                  className="text-red-400 hover:text-red-600"
                >
                  ❌
                </button>

              </div>

              {/* Progress */}
              <div className="mb-4">

                <div className="flex justify-between text-sm mb-1 text-gray-300">

                  <span>
                    {completedTasks} / {totalTasks} completed
                  </span>

                  <span>
                    {percentage}%
                  </span>

                </div>

                <div className="w-full bg-zinc-700 h-3 rounded-full overflow-hidden">

                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${percentage}%`
                    }}
                  ></div>

                </div>

              </div>

              {/* Add Task */}
              <div className="flex gap-2 mb-4">

                <input
                  type="text"
                  placeholder="New task"
                  className="bg-zinc-700 px-3 py-2 rounded-lg outline-none w-full"
                  value={
                    taskInputs[category._id] || ""
                  }
                  onChange={(e) =>
                    setTaskInputs(prev => ({
                      ...prev,
                      [category._id]:
                        e.target.value
                    }))
                  }
                />

                <button
                  onClick={() =>
                    addTask(category._id)
                  }
                  className="bg-green-600 px-4 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>

              </div>

              {/* Tasks */}
              <div className="space-y-3">

                {categoryTasks.map((task) => (

                  <div
                    key={task._id}
                    className="flex items-center gap-3 bg-zinc-700 p-3 rounded-lg"
                  >

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        toggleTask(
                          task._id,
                          category._id
                        )
                      }
                      className="w-4 h-4"
                    />

                    <div className="flex items-center justify-between w-full">

                      <p
                        className={
                          task.completed
                            ? "line-through text-gray-400"
                            : ""
                        }
                      >
                        {task.title}
                      </p>

                      <button
                        onClick={() =>
                          deleteTask(
                            task._id,
                            category._id
                          )
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        ❌
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default App