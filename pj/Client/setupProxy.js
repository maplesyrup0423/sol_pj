import { createProxyMiddleware } from "http-proxy-middleware";

export default (app) => {
    console.log("setupProxy 진입 : ");
    app.use(
        createProxyMiddleware("/api", {
            target: "http://localhost:5000",
            changeOrigin: true,
        })
    );
};
