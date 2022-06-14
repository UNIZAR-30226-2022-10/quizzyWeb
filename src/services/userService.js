import axios from "axios"
import authHeader from "./authHeader"

const API_URL = process.env.REACT_APP_API_ENDPOINT
// Get user cosmetics
const getCosmetics = () => {
    return axios
        .get(API_URL + "/user/cosmetics", { headers: authHeader() })
        .then((response) => {
            return response.data
        })
}

// Get user wildcards
const getWildcards = () => {
    return axios
        .get(API_URL + "/user/wildcards", { headers: authHeader() })
        .then((response) => {
            return response.data
        })
}

// Set the current user cosmetic
const useWildcard = async (id) => {
    return await axios
        .put(API_URL + `/user/use?id=${id}`, {}, { headers: authHeader() })
        .then((response) => {
            return response.data
        })
}

//get user info
const getUser = async () => {
    return await axios
        .get(API_URL + "/user", { headers: authHeader() })
        .then((response) => {
            return response
        })
}

const equipCosmetic = async (cosmeticId) => {
    return await axios
        .put(API_URL + "/user/equip", { id: cosmeticId }, { headers: authHeader() })
        .then((response) => {
            return response
        })
}

const searchUsers = async (nickname) => {
    return await axios
        .get(API_URL + "/user/search", { params: {nickname} , headers: authHeader() })
        .then((response) => {
            return response
        })
}

const userService = {
    getCosmetics,
    getWildcards,
    useWildcard,
    getUser,
    equipCosmetic,
    searchUsers
}
export default userService
