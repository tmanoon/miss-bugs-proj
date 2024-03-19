
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
    getDefaultFilter,
    getFilterFromParams
}


function query(filterBy = getDefaultFilter()) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
            .then(res => res.data)
    // return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
            .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug)
                .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
        .then(res => res.data)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, labels: '', sortBy: '', sortDir: 1 }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        txt: searchParams.get('txt') || defaultFilter.txt,
        minSeverity: searchParams.get('minSeverity') || defaultFilter.minSeverity,
        labels: searchParams.get('labels') || defaultFilter.labels,
        sortBy:  searchParams.get('sortBy') || defaultFilter.sortBy,
        sortDir:  searchParams.get('sortDir') || defaultFilter.sortDir
    }
}