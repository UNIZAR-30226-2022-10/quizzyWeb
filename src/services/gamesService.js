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

const getInvites = async () => {
    return await axios.get(API_URL +"/games/invite", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const sendInvite = async (rid, nickname) => {
    return await axios.post(API_URL +"/games/invite", { nickname, rid }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const removeInvite = async (rid, nickname) => {
    return await axios.delete(API_URL +"/games/invite", { headers: authHeader(), data: { rid, nickname } })
        .then((response) => {
            return response.data;
        });
}

const getPublicHistory = async () => {
    return await axios.get(API_URL +"/games/history/public", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const getPrivateHistory = async () => {
    return await axios.get(API_URL +"/games/history/private", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const gamesService = {
    getPublicGames,
    getPrivateGames,
    getInvites,
    sendInvite,
    removeInvite,
    getPublicHistory,
    getPrivateHistory
};

export default gamesService;