import { createProxyMiddleware } from "http-proxy-middleware";

export default (app) => {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://localhost:5000",
            changeOrigin: true,
        })
    );
};
