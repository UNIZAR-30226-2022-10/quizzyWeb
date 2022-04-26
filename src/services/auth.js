import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const register = (nickname, email, password) => {
  return axios.post(API_URL +"/user", {
    nickname,
    email,
    password,
  });
};
const login = (nickname, password) => {
  return axios
    .post(API_URL + "/user/login", {
      nickname,
      password,
    })
    .then((response) => {
      if (response.data.ok) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    });
};
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
const isLoggedIn = () => { 
  return JSON.parse(localStorage.getItem("token")) ? true : false;
}
/* Locally verify token with token from local storage */
const verifyToken = () => {
  return axios
  .get(API_URL + "/user", { headers: authHeader() })
  .then((response) => {
    let user = {
      actual_cosmetic: response.data.actual_cosmetic,
      email: response.data.email,
      nickname: response.data.nickname,
      wallet: response.data.wallet,
    }
    return user;
  });
}
const AuthService = {
  register,
  login,
  logout,
  isLoggedIn,
  verifyToken
};
export default AuthService;