import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;
// Get user cosmetics
const getCosmetics = () => {
  return axios.get(API_URL +"/user/cosmetics", { headers: authHeader() })
  .then((response) => {
    return response.data;
  });
};

// Get user wildcards
const getWildcards = () => {
  return axios.get(API_URL +"/user/wildcards", { headers: authHeader() })
  .then((response) => {
    return response.data;
  });
};

// Set the current user cosmetic
const setWildcard = () => {
  return axios.get(API_URL +"/user/wildcards", { headers: authHeader() })
  .then((response) => {
    return response.data;
  });
};

//get user info
const getUser = () => {
  return axios.get(API_URL +"/user", { headers: authHeader() })
  .then((response) => {
    return response;
  });
};

const equipCosmetic = (cosmeticId) => {
  return axios.put(API_URL + "/user/equip", { id : cosmeticId }, { headers: authHeader() })
  .then((response) => {
    return response;
  });
};




const userService = {
  getCosmetics,
  getWildcards,
  setWildcard,
  getUser,
  equipCosmetic
};
export default userService;