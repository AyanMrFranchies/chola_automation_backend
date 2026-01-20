import express from "express";
// import {
//   startEmbeddedSignup,
// } from "../../controllers/metaController/embed_Signup_controller.js";
import {completeSignup} from "../../controllers/metaController/call_back_controller.js" 
 export const metaRoutes = express.Router();

// metaRoutes.get("/signup-url", startEmbeddedSignup);
// metaRoutes.get("/callback", metaCallback);
metaRoutes.post("/meta/complete-signup", completeSignup);
  