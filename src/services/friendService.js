import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

// Get list of friends
const getFriends = async () => {
    return await axios.get(API_URL +"/friends", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
};

// Get pending friend requests
const getPending = async () => {
    return await axios.get(API_URL +"/friends/pending", { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
};

const friendService = {
    getFriends,
    getPending,
};

export default friendService;