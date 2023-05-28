require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  console.log(blog)

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
    .catch(error => {
      console.log(error)
      response.status(400).end()
    }) //TODO: doesn't work
  /*   //alkuperäinen   
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  }) */
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
