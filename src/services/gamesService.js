import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const getPublicGames = async () => {
    return await axios.get(API_URL +"/games/public", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const getPrivateGames = async () => {
    return await axios.get(API_URL +"/games/private", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const gamesService = {
    getPublicGames,
    getPrivateGames
};

export default gamesService;