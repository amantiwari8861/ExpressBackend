const { chat, sentimentAnalysis, generateImage } = require("../controller/ai.controller");

const aiRouter = require("express").Router();

aiRouter.post("/chat", chat); // http://localhost:8080/api/v1/chat
aiRouter.post("/analyze", sentimentAnalysis); // http://localhost:8080/api/v1/analyze
aiRouter.post("/generate", generateImage); // http://localhost:8080/api/v1/analyze

module.exports = aiRouter;
