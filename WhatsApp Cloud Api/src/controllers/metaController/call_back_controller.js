import {
  exchangeCodeForToken,
  getBusinessId,
  getWabaId,
  getPhoneNumberId,
} from "../../services/metaServices/meta_services.js";
import MetaConnection from "../../model/metaModels/meta_connection.js";
import axios from "axios";



export const completeSignup = async (req, res) => {
try {
const {
waba_id,
phone_number_id,
business_id,
display_phone_number,
} = req.body;
console.log("✅ completeSignup payload", req.body);

if (!waba_id || !phone_number_id || !business_id) {
return res.status(400).json({ error: "Missing required Meta IDs" });
}


const userId = req.user?.id || "demo-user-id"; // replace with real auth


const record = await MetaConnection.create({
userId,
metaBusinessId: business_id,
wabaId: waba_id,
phoneNumberId: phone_number_id,
displayPhoneNumber: display_phone_number,
status: "CONNECTED",
});


res.json({ message: "WhatsApp connected", record });
} catch (err) {
console.error("❌ completeSignup error", err);
res.status(500).json({ error: "Failed to save Meta connection" });
}
};

export const metaCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user.id; // from auth middleware
    const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log("Meta webhook verification attempt", req.query);
  console.log("Meta webhook code received", code);
  console.log("Meta webhook mode", mode);
  console.log("Meta webhook token", token);

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }

    console.log("Meta callback received code:", code);
    if (!code){
        return res.status(400).json({ error: "Authorization code missing" });
    }


    return res.status(200).json({ message: "Meta callback processed successfully" });

    const accessToken = await exchangeCodeForToken(code);
    const businessId = await getBusinessId(accessToken);
    const wabaId = await getWabaId(businessId, accessToken);
    const phoneNumberId = await getPhoneNumberId(wabaId, accessToken);

    await MetaConnection.create({
      userId,
      metaBusinessId: businessId,
      wabaId,
      phoneNumberId,
      accessToken,
      tokenType: "SYSTEM_USER",
      status: "CONNECTED",
    });

    res.redirect("/dashboard?whatsapp=connected");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Meta connection failed" });
  }
};


export const saveSystemUserToken = async (req, res) => {
  const {
    metaBusinessId,
    wabaId,
    phoneNumberId,
    systemUserToken
  } = req.body;

  const userId = req.user.id;

  await MetaConnection.create({
    userId,
    metaBusinessId,
    wabaId,
    phoneNumberId,
    accessToken: systemUserToken,
    tokenType: "SYSTEM_USER",
    status: "CONNECTED"
  });

  res.json({ message: "WhatsApp connected successfully" });
};


export const metaWebhookMessageReceived = async (req, res) => {
  try {
    const entries = Array.isArray(req.body.entry) ? req.body.entry : [];

    entries.forEach((entry) => {
      const changes = Array.isArray(entry.changes) ? entry.changes : [];

      changes.forEach((change) => {
        const messages = Array.isArray(change.value?.messages)
          ? change.value.messages
          : [];

        messages.forEach((msg) => {
          const incoming = {
            from: msg.from,
            type: msg.type,
            text: msg.text?.body || "",
            timestamp: msg.timestamp,
            messageId: msg.id,
            phoneNumberId: change.value?.metadata?.phone_number_id,
          };

          console.log("📩 Incoming WhatsApp message:", incoming);
        });
      });
    });

    // REQUIRED by Meta
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook POST error:", err);
    return res.sendStatus(500);
  }
};


export const metaWebhook = async (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Meta webhook verification attempt:", req.query);

    if (
      mode === "subscribe" &&
      token === process.env.META_VERIFY_TOKEN
    ) {
      console.log("✅ Webhook verified");
      return res.status(200).send(challenge);
    }

    console.log("❌ Webhook verification failed");
    return res.sendStatus(403);
  } catch (err) {
    console.error("Webhook GET error:", err);
    return res.sendStatus(500);
  }
};


export const whatsappCallback = async (req, res) => {
  try {
    // 1️⃣ Meta sends this
    const { code, error, error_description } = req.query;
    console.log("WhatsApp OAuth Callback received:", req.query);

    // Handle Meta error
    if (error) {
      console.error("Meta OAuth Error:", error, error_description);
      return res.status(400).json({
        error,
        error_description,
      });
    }

    // Code is mandatory
    if (!code) {
      return res.status(400).send("Missing authorization code");
    }

    // 2️⃣ Exchange code for access token (SERVER → META)
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: process.env.META_REDIRECT_URI, // MUST MATCH EXACTLY
          code,
        },
      }
    );

    const {
      access_token,
      token_type,
      expires_in,
    } = tokenResponse.data;

    console.log("✅ Meta Access Token:", access_token);

    // 3️⃣ TODO: Store securely in DB (VERY IMPORTANT)
    // await saveTokenToDB({ access_token, token_type, expires_in });

    // 4️⃣ Redirect user to frontend success page
    return res.redirect(
      "https://localhost:5173/success?source=whatsapp_oauth"
    );

  } catch (err) {
    console.error(
      "OAuth Callback Error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: "WhatsApp OAuth failed",
      error: err.response?.data || err.message,
    });
  }
};
