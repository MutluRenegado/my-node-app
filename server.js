const express = require("express");
const axios = require("axios"); // To make HTTP requests

const app = express();
const port = process.env.PORT || 3000; // Use Railway's assigned port

app.get("/", (req, res) => {
    res.send("Welcome to the OAuth Server!");
});

// Existing /auth route (if needed)
app.get("/auth", (req, res) => {
    const { instanceId } = req.query;
    if (!instanceId) {
        return res.status(400).send("Missing instanceId");
    }
    res.redirect("https://yogaproductstop.com/dashboard");
});

// OAuth Redirect Route
app.get("/oauth/redirect", async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    const clientId = "YOUR_CLIENT_ID";
    const clientSecret = "YOUR_CLIENT_SECRET";
    const redirectUri = "https://intelligent-creativity.railway.app/oauth/redirect"; // Update with your deployed URL

    try {
        const response = await axios.post("https://www.wix.com/oauth/access", {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        });

        const { access_token, refresh_token } = response.data;
        res.json({ access_token, refresh_token });
    } catch (error) {
        console.error("Error during token exchange:", error.response?.data || error.message);
        res.status(500).send("Error during OAuth exchange");
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
