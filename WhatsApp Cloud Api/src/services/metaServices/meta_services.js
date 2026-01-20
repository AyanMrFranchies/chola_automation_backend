import axios from "axios";

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION}`;

export const exchangeCodeForToken = async (code) => {
  const res = await axios.post(`${GRAPH}/oauth/access_token`, null, {
    params: {
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      redirect_uri: process.env.META_REDIRECT_URI,
      code
    }
  });
  return res.data.access_token;
};

export const getBusinessId = async (token) => {
  const res = await axios.get(`${GRAPH}/me/businesses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data[0].id;
};

export const getWabaId = async (businessId, token) => {
  const res = await axios.get(
    `${GRAPH}/${businessId}/owned_whatsapp_business_accounts`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data[0].id;
};

export const getPhoneNumberId = async (wabaId, token) => {
  const res = await axios.get(
    `${GRAPH}/${wabaId}/phone_numbers`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data[0].id;
};
