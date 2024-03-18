
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = `/api/bug/`
// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL)
            .then(res => res.data)
            .then(bugs => {return bugs} )
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
            .then(res => res.data)
    // return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
            .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.get(BASE_URL + `save?title=${bug.title}&severity=${bug.severity}&_id=${bug._id}&description=${bug.description}`)
                .then(res => res.data)
    } else {
        return axios.get(BASE_URL + `save?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`)
        .then(res => res.data)
    }
}

// app.get('/api/bug/save', (req, res) => {
//     const bugToSave = {
//         title: req.query.title,
//         severity: +req.query.severity,
//         _id: req.query._id
//     }

//     bugsService.save(bugToSave)
//         .then(bug => {
//             console.log(bug)
//             res.send(bug)
//         })

//         .catch((err) => {
//             // loggerService.error('Cannot save bug', err)
//             res.status(400).send('Cannot save bug', err)
//         })
// }) 
// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = [
//             {
//                 title: "Infinite Loop Detected",
//                 severity: 4,
//                 _id: "1NF1N1T3"
//             },
//             {
//                 title: "Keyboard Not Found",
//                 severity: 3,
//                 _id: "K3YB0RD"
//             },
//             {
//                 title: "404 Coffee Not Found",
//                 severity: 2,
//                 _id: "C0FF33"
//             },
//             {
//                 title: "Unexpected Response",
//                 severity: 1,
//                 _id: "G0053"
//             }
//         ]
//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }




