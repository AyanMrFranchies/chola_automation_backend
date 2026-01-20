import axios from "axios";
import MetaConnection from "../models/MetaConnection.js";

export const sendMessage = async (req, res) => {
  const { to, text } = req.body;
  const userId = req.user.id;

  const meta = await MetaConnection.findOne({ userId });

  const url = `https://graph.facebook.com/v18.0/${meta.phoneNumberId}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${meta.accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

  res.json({ message: "Message sent successfully" });
};
