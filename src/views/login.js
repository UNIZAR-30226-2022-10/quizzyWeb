import React, { useState } from "react"
import Container from '@mui/material/Container'
import { useNavigate } from "react-router-dom"
import AuthService from "services/auth"
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import "index.css"

function Login() {
    const [details, setDetails] = useState({ nickname: "", psw: ""})
    const [error, setError] = useState("")
    const [logged, setLogged] = useState(false)
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()
        Login(details)
    }

    React.useEffect(() => {
        if (AuthService.isLoggedIn()) {
            console.log("already logged in")
            setLogged(true)
            navigate("/")
        } else
        console.log("not logged in")
    }, [])

    const Login = (details) => {
        if (details.nickname !== "" && details.psw !== "") {
            AuthService.login(details.nickname, details.psw)
                .then(res => {  
                    if (res.ok) {
                        setLogged(true)
                        console.log("Logged in")
                        setTimeout(() => {
                            navigate("/")
                        }, 3000)
                    }
                    else
                        setError(res.msg)
                })
                .catch((err) => { 
                    setError(err.response.data.msg)
            })
        }
        else {
            setError("Please fill in all fields")
        }
    }

    return (
        <div className="App">
            <form className="customForm" onSubmit={submitHandler}>
            <div className="form-inner">
                <Container sx={{display:'flex',justifyContent:'space-around'}}>
                    <h2>Log in</h2>
                    <img height="100" src={process.env.PUBLIC_URL + "/images/quizzylogo.png"} alt=""></img>
                </Container>
                {error != "" ? <div className="error">{error}</div> : ""}
                <div className="form-group">
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        name="nickname"
                        onChange={(e) =>
                            setDetails({ ...details, nickname: e.target.value })
                        }
                        value={details.nickname}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="psw">Password:</label>
                    <input
                        type="password"
                        name="psw"
                        onChange={(e) =>
                            setDetails({ ...details, psw: e.target.value })
                        }
                        value={details.psw}
                    />
                </div>   
                <input type="submit" value="Login" />
            </div>
            </form>

            <br/>
            
            <p>
                {logged ? 
                    <Alert severity="success">
                        <AlertTitle> <strong> Welcome </strong> </AlertTitle>
                    </Alert>
                    : ""
                }
            </p>
          
        </div>
    )
}

export default Login
