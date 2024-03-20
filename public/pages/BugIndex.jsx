import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
const { Link, useSearchParams } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams))
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        setSearchParams(filterBy)
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy).then(bugs => setBugs(bugs))
    }

    function onSetFilter(fieldsToUpdate) {
        setFilterBy(prevFilter => {
            if (prevFilter.pageIdx !== undefined) prevFilter.pageIdx = 0
            return { ...prevFilter, ...fieldsToUpdate }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: filterBy.pageIdx === undefined ? 0 : undefined
        }))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Description?'),
            labels: prompt('Enter at least two labels, separated by commas (= ",")'),
            creator: userService.getLoggedinUser()
        }
        console.log(bug)
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <button onClick={() => onChangePage(-1)}>-</button>
            <span>{filterBy.pageIdx + 1 || 'No pagination'}</span>
            <button onClick={() => onChangePage(1)}>+</button>
            <button onClick={onTogglePagination}>Toggle Pagination</button>
            <h3>Bugs App</h3>
            <main>
                <BugFilter onSetFilter={debounceOnSetFilter.current} filterBy={filterBy} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
