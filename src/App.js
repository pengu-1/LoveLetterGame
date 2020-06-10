import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';
import ProtectedRoute from './components/ProtectedRoute'
import AuthContext from './AuthContext'
import Room from './components/Room'
import Lobby from './components/Lobby'
import CreateUser from './components/CreateUser'
import './axiosConfig'

function App() {
    const [authDetails, setAuthDetails] = React.useState(sessionStorage.getItem("token"))

    function setAuth(token, name) {
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("name", name)
        setAuthDetails(token)
    }

    return (
        <AuthContext.Provider value={authDetails}>
            <Router>
                <Switch>
                    <Route exact path="/createuser" render={(props) => {
                        return <CreateUser {...props} setAuth={setAuth} />
                    }}
                    />
                    <ProtectedRoute exact path="/" render={(props) => {
                        return <Lobby {...props} />
                    }}
                    />
                    <ProtectedRoute path="/:id" render={(props) => {
                        return <Room {...props} />
                    }}
                    />
                </Switch>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;
