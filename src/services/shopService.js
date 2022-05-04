import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const getCosmetics = () => {
  return axios.get(API_URL +"/shop/cosmetics")
  .then((response) => {
    return response.data;
  });
};
const getWildcards = () => {
  return axios.get(API_URL +"/shop/wildcards")
  .then((response) => {
    return response.data;
  });
};

const buyCosmetics = (id) => {
  return axios
  .post(API_URL + "/shop/cosmetics/buy", 
  { id }, 
  { headers: authHeader()})
  .then((response) => {
    
    return response;
  });
};
const buyWildcards = (id,amount) => {
  return axios
  .post(API_URL + "/shop/wildcards/buy", 
  { id, amount }, 
  { headers: authHeader()})
  .then((response) => {
    
    return response;
  });
};
const shopService = {
  getCosmetics,
  getWildcards,
  buyCosmetics,
  buyWildcards
};
export default shopService;