// index.js
const express = require('express');
const axios = require('axios');  // To make HTTP requests
const app = express();
const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New /oauth/redirect route for handling OAuth token exchange
app.get("/oauth/redirect", async (req, res) => {
    const { code } = req.query;  // Get the authorization code from Wix
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    const clientId = 'YOUR_CLIENT_ID';  // Replace with your Wix client ID
    const clientSecret = 'YOUR_CLIENT_SECRET';  // Replace with your Wix client secret
    const redirectUri = 'https://your-railway-app.com/oauth/redirect';  // Your registered redirect URI on Wix

    try {
        // Make a POST request to Wix to exchange the code for an access token
        const response = await axios.post('https://www.wix.com/oauth/access', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });

        // Extract access token and refresh token from the response
        const { access_token, refresh_token } = response.data;

        // Store tokens securely (e.g., in a session or database)
        res.json({ access_token, refresh_token });
    } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).send('Error during OAuth exchange');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
