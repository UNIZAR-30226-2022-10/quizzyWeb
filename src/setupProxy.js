const { createProxyMiddleware } = require("http-proxy-middleware")

const API_URL = process.env.REACT_APP_API_ENDPOINT;

module.exports = function (app) {
    if ( process.env.ENABLE_PROXY === "yes" ) {
        console.log("Enabled proxy")
        app.use(
            "/api",
            createProxyMiddleware({
                target: API_URL,
                changeOrigin: true,
            })
        )
    }
}
