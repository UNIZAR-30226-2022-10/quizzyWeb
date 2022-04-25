export default function authHeader() {
  const token = localStorage.getItem("token") ? 'Bearer ' + JSON.parse(localStorage.getItem("token")).token : null;
  if (token) {
    // for Node.js Express back-end
    return { 'authorization': token };
  } else {
    return {};
  }
}