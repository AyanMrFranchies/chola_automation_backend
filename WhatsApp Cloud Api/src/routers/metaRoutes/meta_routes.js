import express from "express";
import {
  startEmbeddedSignup,
} from "../../controllers/metaController/embed_Signup_controller.js";
import {completeSignup, metaWebhook, metaWebhookMessageReceived, whatsappCallback} from "../../controllers/metaController/call_back_controller.js" 
 export const metaRoutes = express.Router();

metaRoutes.get("/signup-url", startEmbeddedSignup);
metaRoutes.get("/whatsapp/webhook", metaWebhook);
metaRoutes.post("/whatsapp/webhook", metaWebhookMessageReceived);
metaRoutes.get("/whatsapp/redirect", whatsappCallback);
metaRoutes.post("/meta/complete-signup", completeSignup);
  