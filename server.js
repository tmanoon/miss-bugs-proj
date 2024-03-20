import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { bugsService } from './services/bugs.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        desc: req.query.labels || '',
        minSpeed: +req.query.minSeverity || 0,
        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || '',
        pageIdx: req.query.pageIdx
    }
    
    bugsService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => console.log('err', err))

})

app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels
    }

    bugsService.save(bugToSave, loggedinUser)
        .then(bug => {
            console.log(bug)
            res.send(bug)
        })

        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug', err)
        })
}) 

app.put('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
        _id: req.body._id
    }

    bugsService.save(bugToSave, loggedinUser)
        .then(bug => {
            console.log(bug)
            res.send(bug)
        })

        .catch((err) => {
            console.log('err', err)
            // loggerService.error('Cannot save bug', err)
            res.status(400).send(err => console.log('Cannot save bug', err))
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const bugId = req.params.bugId
    bugsService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            // loggerService.error('Cannot remove car', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => {
            console.log('err', err)
            return
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3039, () => console.log('Server ready at port 3039'))