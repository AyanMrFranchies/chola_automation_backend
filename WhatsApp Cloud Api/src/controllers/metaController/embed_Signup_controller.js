

export const startEmbeddedSignup = async (req, res) => {
  res.json({
    appId: process.env.META_APP_ID,
    configId: process.env.META_EMBEDDED_SIGNUP_CONFIG_ID,
  });
};
    