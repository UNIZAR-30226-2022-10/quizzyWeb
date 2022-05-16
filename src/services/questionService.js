import axios from "axios";
import authHeader from './authHeader';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

/**
 * Send a new question proposal to review
 * @param {String} stmt The question statement
 * @param {String} cat The question's suggested category
 * @param {String} diff The question's suggested question
 * @param {String} c The correct answer
 * @param {String} w1 The first wrong answer
 * @param {String} w2 The second wrong answer
 * @param {String} w3 The third wrong answer
 * @returns {Promise} A promise with the proposal's result
 */
const sendProposal = async (stmt, cat, diff, c, w1, w2, w3) => {
    return axios.post(API_URL +"/questions/proposal", 
        { 
            statement : stmt, 
            category : cat, 
            difficulty: diff, 
            correctAnswer : c, 
            wrongAnswer1 : w1, 
            wrongAnswer2 : w2, 
            wrongAnswer3 : w3, 
            nickname : JSON.parse(localStorage.getItem("user")).nickname }, 
        { headers: authHeader() })
    .then((response) => {
        return response.data;
    });
}

const questionService = {
    sendProposal,
}

export default questionService;