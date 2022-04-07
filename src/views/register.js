import { useState } from "react"
import AuthService from "services/auth"
import { useNavigate } from "react-router-dom";
import "index.css"
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'


function Register() {
    const [error, setError] = useState("")
    const [details, setDetails] = useState({ nickname: "", mail: "", psw: "", confirmPsw:""})
    const [registered,setRegistered] = useState(false)
    const submitHandler = (e) => {
        e.preventDefault()
        Register(details)
    }
    let navigate = useNavigate();
    const Register = (details) => {
        setError("")
        if (details.psw === details.confirmPsw) {
            AuthService.register(details.nickname, details.mail, details.psw)
                .then(res => {  
                    if (res.data.ok) {
                        console.log("lezgo")
                        setRegistered(true)
                        setTimeout(() => {
                            navigate("/login")
                        }, 2000)   
                    }
                    else
                        setError(res.msg)
                }
                )
                .catch((err) => { 
                    setError(err.response.data.msg)
                })
        }
        else {
            setError("Passwords don't match")
        }
        setTimeout(() => {
            setError("")
        }   , 3000) 
    }
    const Logout = () => {
        AuthService.logout()
    }

    return (
        <div className="App" maxWidth="xs" sx={{display:'flex',flexDirection:'column'}}>
             <form onSubmit={submitHandler}>
                <div className="form-inner">
                    <Container sx={{display:'flex',justifyContent:'space-around'}}>
                        <h2>Register</h2>
                        <img height="100" src={process.env.PUBLIC_URL + "/images/quizzylogo.png"} alt=""></img>
                    </Container>
                    {error !== "" ? <div className="error">{error}</div> : ""}
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
                        <label htmlFor="mail">E-mail:</label>
                        <input
                            type="email"
                            name="mail"
                            onChange={(e) =>
                                setDetails({ ...details, mail: e.target.value })
                            }
                            value={details.mail}
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
                    <div className="form-group">
                        <label htmlFor="confirmpsw">Confirm Password:</label>
                        <input
                            type="password"
                            name="psw"
                            onChange={(e) =>
                                setDetails({ ...details, confirmPsw: e.target.value })
                            }
                            value={details.confirmPsw}
                        />
                    </div>
                    <input type="submit" value="Register" />
                </div>
            </form>

            <br/>
            <p>
                {registered ? 
                
                        <Alert severity="success">
                            <AlertTitle> <strong> Redirect to Log In Page </strong> </AlertTitle>
                        </Alert>
                    : ""
                }
             </p>
           
        </div>
    )
}

export default Register
