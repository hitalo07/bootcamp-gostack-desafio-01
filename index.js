const express = require("express")

const app = express()

app.use(express.json())

const projects = []
let numRequests = 0

app.use((req, res, next) => {
    numRequests++

    console.log(`Number of requests so far: ${numRequests}`)

    return next()
})

function checkProjectExists (req, res, next) {
    const { id } = req.params

    console.log(projects)

    const project = projects.find(project => project.id == id)

    if (!project) {
        return res.status(400).json({ error: 'Project not found!' })
    }
    return next()
}

app.get('/projects', (req, res) => {
    return res.json(projects)
})

app.post('/projects', (req, res) => {
    const { id, title } = req.body

    projects.push({
        id,
        title,
        tasks: []
    })

    return res.status(201).json(projects)
})

app.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params

    const { title } = req.body

    projects.find(project => project.id == id).title = title

    return res.json(projects)

})

app.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params

    const project = projects.findIndex(project => project.id == id)

    projects.splice(project, 1)

    return res.send()

})

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params
    
    const { title } = req.body

    projects.find(project => project.id == id)
        .tasks.push(title)

    return res.status(201).send(projects)

})

app.listen(3000)