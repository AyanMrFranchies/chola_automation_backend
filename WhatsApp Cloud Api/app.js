import express from "express";
import cors from "cors";
import router from "./src/routers/index.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173","https://eileen-slothful-stereochromatically.ngrok-free.dev","https://cholabiz.web.app"],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running.....");
});

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// ✅ Replace with your WhatsApp Phone Number ID and Access Token
const PHONE_NUMBER_ID = "992700260585658";
const ACCESS_TOKEN = "EAAMbMH1YgikBQqy9kWxfMAG9msKAyvkcrfiPK33CoSw3CbiwjDvxHvFlikELy9wogmbAux0cLINg3Grz3r0moCpkCFExcxrmfBYwvDQCeJG2vZCe3oCw0ZCyXTpBVRMJ4G3PFRwhfoARgoZBskTTQN6b9tf3efnI1pGAZCPPAzdRSVPBxRZCRRxkvF497bgpUcte5FqyJKSKFc1p3SEMQMd7pTFV8SdIHBffOGC7bSlJUgyPl9cG1jx41bieXW3HYRrWG9d8569kqFuPsvY196Wsp"


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


const BUSINESS_ID = '726772596855839';
app.get('/check-whatsapp-status', async (req, res) => {
  try {
    // Step 1: Fetch owned WhatsApp Business Accounts
    const wabaRes = await axios.get(
      `https://graph.facebook.com/v19.0/${BUSINESS_ID}/owned_whatsapp_business_accounts?access_token=${ACCESS_TOKEN}`
    );

    if (wabaRes.data.data.length === 0) {
      return res.json({ status: 'NOT_CONNECTED' });
    }

    const waba = wabaRes.data.data[0];
    const WABA_ID = waba.id;

    // Step 2: Fetch phone numbers under WABA
    const phoneRes = await axios.get(
      `https://graph.facebook.com/v19.0/${WABA_ID}/phone_numbers?access_token=${ACCESS_TOKEN}`
    );

    if (phoneRes.data.data.length === 0) {
      return res.json({ status: 'CONNECTED_NO_PHONE' });
    }

    const phoneNumberId = phoneRes.data.data[0].id;
    res.json({
      status: 'CONNECTED',
      wabaId: WABA_ID,
      phoneNumberId,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});


app.post('/send-message', async (req, res) => {
  const { phoneNumberId, to, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      },
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});


app.use("/api", router);

export default app;
