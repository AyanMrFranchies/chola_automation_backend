import express from "express";
import {
  startEmbeddedSignup,
} from "../../controllers/metaController/embed_Signup_controller.js";
import {completeSignup, metaCallback} from "../../controllers/metaController/call_back_controller.js" 
 export const metaRoutes = express.Router();

metaRoutes.get("/signup-url", startEmbeddedSignup);
metaRoutes.get("/whatsapp/callback", metaCallback);
metaRoutes.post("/meta/complete-signup", completeSignup);
  