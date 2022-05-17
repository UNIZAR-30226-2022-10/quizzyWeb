import { useState } from "react"
import AuthService from "services/auth"
import { useNavigate } from "react-router-dom";
import "index.css"

import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form';
import { Typography } from "@mui/material";

const bcrypt = require("bcryptjs")

function Register() {
    const [DBerror, setDBerror] = useState("") 
    const [registered,setRegistered] = useState(false)
    const { register, formState: { errors },getValues, handleSubmit } = useForm({
        mode: "all" // "onChange"
      });
    const onSubmit = (data) => {
        Register(data)
    }
    let navigate = useNavigate();
    const Register = async (data) => {
        setDBerror("")
        if (data.Password === data.ConfirmPassword) {
            const hash = await bcrypt.hash(data.Password, 10);
            AuthService.register(data.Nickname, data.Email, hash)
                .then(res => {  
                    if (res.data.ok) {
                        console.log("Registered")
                        setRegistered(true)
                        setTimeout(() => {
                            navigate("/login")
                        }, 2000)   
                    }
                    else {
                        setDBerror(res.msg)
                        setTimeout(() => {
                            setDBerror("")
                        }   , 3000) 
                    }
                })
                .catch((err) => { 
                    setDBerror(err.response.data.msg)
                })
        }
        else {
            setDBerror("Passwords must match")
            setTimeout(() => {
                setDBerror("")
            }   , 3000) 
        }
        
    }

    return (
        <div className="App">
            <Container maxWidth="xs" sx={{display:'flex',flexDirection:'column'}}>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-inner">
                                <Container sx={{display:'flex',justifyContent:'space-around'}}>
                                    <h2>Register</h2>
                                    <img height="100" src={process.env.PUBLIC_URL + "/images/quizzylogo.png"} alt=""></img>
                                </Container>
                                
                                <div className="form-group">
                                    <label htmlFor="nickname">Nickname :</label>
                                    <input 
                                        type="text"
                                        name="nickname"
                                        aria-invalid={errors.Nickname ? "true" : "false"}
                                        autoComplete="username"
                                        {...register("Nickname", {
                                            required: {value: true, message: "Nickname is required"},
                                            maxLength: {value: 20, message: "Nickname must be 20 characters or less"},
                                            minLength: {value: 3, message: "Nickname must be 3 characters or more"}
                                        })}  
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.Nickname && errors.Nickname.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mail">E-mail:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        aria-invalid={errors.Email ? "true" : "false"}
                                        {...register("Email", {
                                            required: {value: true, message: "Email is required"}, 
                                            maxLength: {value:50, message: "Email must be 50 characters or less"},
                                            pattern: {value: /^\S+@\S+$/i, message: "Email must include '@' to respect a valid email pattern"},
                                        })}
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.Email && errors.Email.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        aria-invalid={errors.Password ? "true" : "false"}
                                        {...register("Password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be 8 characters or more"
                                            },
                                        })}
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.Password && errors.Password.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmpassword">Confirm Password:</label>
                                    <input
                                        type="password"
                                        name="confirmpassword"
                                        autoComplete="new-password"
                                        aria-invalid={errors.ConfirmPassword ? "true" : "false"}
                                        {...register("ConfirmPassword", {
                                            required: "Please confirm password !",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be 8 characters or more"
                                            },
                                            validate: {
                                            matchesPreviousPassword: (value) => {
                                                const { Password } = getValues();
                                                return Password === value || "Passwords should match!";
                                            }
                                            }
                                        })}
                                        />
                                    <Typography variant="caption" color="error" role="alert">
                                        {errors.ConfirmPassword && errors.ConfirmPassword.message}
                                    </Typography>
                                </div>
                                {DBerror !== "" ? <div className="error">{DBerror}</div> : ""}
                                <Grid container>
                                    <Grid item xs={4}>
                                        <input type="submit" />
                                    </ Grid>
                                    <Grid item xs={8}>
                                        <Link href="/login" variant="body2">
                                            {"Already have an account? Sign In"}
                                        </Link>
                                    </Grid>

                                </Grid>
                            
                            </div>
                        </form>
                    </Grid>

                    <Grid item xs={6}>
                        {registered ? 
                                <Alert severity="success">
                                    <AlertTitle> <strong> Redirect to Log In Page </strong> </AlertTitle>
                                </Alert>
                            : ""
                        }
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Register
