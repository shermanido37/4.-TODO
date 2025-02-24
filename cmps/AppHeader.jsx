const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux
import { login, signup } from '../store/actions/user.actions.js'

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector((storeState) => storeState.userModule.loggedInUser)
    
    function onLogout() {
        try{
            logout()
            showSuccessMsg("You have successfully logged out.")
        }
        catch(err){
            showErrorMsg("There was an error handling your request.")
            console.log(err)
        }
    }

    async function onSetUser(credentials, isSignup) {
        try{
            isSignup ? await signup(credentials) : await login(credentials)
            isSignup ? 
                showSuccessMsg("You have successsfully signed up.")
                :
                showSuccessMsg("Your login was successful.")
        }
        catch(err){
            showErrorMsg("There was an error handling your request.")
            console.log(err)
        }
        navigate('/')
    }
    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
