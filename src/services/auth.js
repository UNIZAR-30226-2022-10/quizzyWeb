import axios from "axios";

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
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.token));
      }
      return response.data;
    });
};
const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const isLoggedIn = () => { 
  return localStorage.getItem("user") ? true : false;
}
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
};
export default AuthService;