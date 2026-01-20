import express from "express";
import { createRegistration } from "../../controllers/registrationController/registration_controller.js";




export const registrationRoutes  = express.Router()



registrationRoutes.post("/register", createRegistration);
registrationRoutes.post("/login", createRegistration);