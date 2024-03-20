import fs from 'fs'
import { utilService } from "./util.service.js"

const PAGE_SIZE = 2

export const bugsService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy) {
    let bugsToReturn = bugs
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title) || regex.test(bug.description) || bug.labels.some(label => regex.test(label)))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (filterBy.labels) {
        bugsToReturn = bugsToReturn.filter(bug => {
            return bug.labels.some(label => filterBy.labels.includes(label))
        })
    }
    if(filterBy.sortBy) {
        if(filterBy.sortBy === 'title') bugsToReturn = bugsToReturn.sort((firstBug, secondBug) => (firstBug[filterBy.sortBy].localeCompare(secondBug[filterBy.sortBy])) * filterBy.sortDir )
        else bugsToReturn = bugsToReturn.sort((firstBug, secondBug) => (firstBug[filterBy.sortBy] - secondBug[filterBy.sortBy]) * filterBy.sortDir )
    }

    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(bugsToReturn)
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('The bug does not exist!')
    return Promise.resolve(bug)
}

function remove(id) {
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()

}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(_bug => _bug._id === bug._id)
        if (!loggedinUser.isAdmin &&
            bugToUpdate.creator._id !== loggedinUser._id) {
            return Promise.reject('Not your bug')
        }
        bugs[bugIdx] = bug
    } else {
        console.log('there')
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.labels = bug.labels.replaceAll(' ', '').split(',')
        bug.creator = loggedinUser
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}