import express from "express";
import { registrationRoutes } from "./registrationRoutes/registration_routes.js";
import {metaRoutes} from "./metaRoutes/meta_routes.js"
const router = express.Router();



router.use("/v1", registrationRoutes);
router.use("/v1", metaRoutes);





export default router;
