import express from "express";
import cors from "cors";
import router from "./src/routers/index.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173","https://eileen-slothful-stereochromatically.ngrok-free.dev"],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// ✅ Replace with your WhatsApp Phone Number ID and Access Token
const PHONE_NUMBER_ID = "992700260585658";
const ACCESS_TOKEN = "EAAMbMH1YgikBQgG0LmjogiEILAZC3eEbiJJCGOgIacO4ESTEmIJLTjrVphJZCL1V7ZApxd6r9JVXhkaOdSnyCI0MLnbefG275YabbuxZBk4OiGfPCg8DJ1tp89cQRsj5NtpZASijswlaXphEGrr0JLR7DztB22uZAK4VQRbwT5B8FSJWarTZA3z4xXQJZBYV5ZCcFXa7FyKOozaYPzwHKylG7Lh5vKfoUijOuFj0bVSVeB1JVQTHF4GQNZCtDt4UpTQVLeSQz1TCiad3cGd2Va20ZBkqfzn";


// Send WhatsApp message (text or template)
app.post("/api/send-whatsapp", async (req, res) => {
  const { to, type, message, templateName, templateParams } = req.body;

  console.log("Request body:", req.body);
  if (!to) return res.status(400).json({ error: "'to' number is required" });

  let bodyPayload;

  if (type === "template") {
    if (!templateName) return res.status(400).json({ error: "'templateName' is required" });
    bodyPayload = {
      messaging_product: "whatsapp",
      to: to.replace(/[^0-9]/g, ""),
      type: "template",
      template: {
        name: templateName,      // template name created in Meta WABA
        language: { code: "en_US" },
        components: templateParams ? [
          {
            type: "body",
            parameters: templateParams.map((t) => ({ type: "text", text: t })),
          },
        ] : [],
      },
    };
  } else {
    // default to text
    if (!message) return res.status(400).json({ error: "'message' is required" });
    bodyPayload = {
      messaging_product: "whatsapp",
      to: to.replace(/[^0-9]/g, ""),
      type: "text",
      text: { body: message },
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(bodyPayload),
      }
    );

    const data = await response.json();
    console.log("WhatsApp API response:", data);

    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.use("/api", router);

export default app;
