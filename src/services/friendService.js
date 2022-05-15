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

const addFriend = async (friendNickname) => {
    return await axios.post(API_URL +"/friends/add", { friendNickname }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const acceptFriend = async (friendNickname) => {
    return await axios.put(API_URL +"/friends/accept", { friendNickname }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
}

const deleteFriend = async (friendNickname) => {
    return await axios.delete(API_URL +"/friends/delete", { headers: authHeader(), data : { friendNickname } })
        .then((response) => {
            return response.data;
        });
}

const friendService = {
    getFriends,
    getPending,
    addFriend,
    acceptFriend,
    deleteFriend
};

export default friendService;