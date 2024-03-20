const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugPreview } from '../cmps/BugPreview.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function UserDetails() {
    const [user, setUser] = useState(null)
    // const { userId } = useParams()
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        const user = userService.getLoggedinUser()
        setUser(user)
        bugService.query()
            .then(bugs => bugs.filter(bug => bug.creator._id === user._id))
            .then(usersBugs => setUserBugs(usersBugs))
    }, [])

    if (!user) return <h1>loadings....</h1>
    return user && <div>
        <h3>User Details 🐛</h3>
        <h4>Username's full name: {user.fullname}</h4>
        <p>Username's ID: <span>{user._id}</span></p>
        {userBugs && <div className='username-bugs'>Username's bugs:
            <ul>
                {userBugs.map(userBug => {
                    return <li>
                        <BugPreview bug={userBug} />
                    </li>
                })}
            </ul>
        </div>}
        <Link to="/">Back to Home</Link>
    </div>
}