import express from 'express'
import cookieParser from 'cookie-parser'
import { bugsService } from './services/bugs.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    bugsService.query()
        .then(bugs => res.send(bugs))
        .catch(err => console.log('err', err))
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query._id
    }

    bugsService.save(bugToSave)
        .then(bug => {
            console.log(bug)
            res.send(bug)
        })

        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug', err)
        })
}) 

app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let visitedBugs = []
    if(req.cookies.visitedBugs) visitedBugs = JSON.parse(req.cookies.visitedBugs)
    bugsService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            // loggerService.error(err)
            res.status(400).send('Cannot get bug')
        })
}) 

app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugsService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            // loggerService.error('Cannot remove car', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.listen(3039, () => console.log('Server ready at port 3039'))