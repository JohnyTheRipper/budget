// server.js
const express = require('express');
const plaid = require('plaid');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize Plaid client
const client = new plaid.Client({
    clientID: 'YOUR_CLIENT_ID',
    secret: 'YOUR_SECRET',
    env: plaid.environments.sandbox, // Use sandbox for testing
});

// Endpoint to get link token
app.post('/get_link_token', async (req, res) => {
    try {
        const response = await client.createLinkToken({
            user: {
                client_user_id: 'USER_ID', // A unique identifier for the user
            },
            client_name: 'Your Budget Manager',
            products: ['transactions'],
            country_codes: ['US'],
            language: 'en',
        });
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating link token');
    }
});

// Endpoint to exchange public token for access token
app.post('/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const tokenResponse = await client.exchangePublicToken(public_token);
        const accessToken = tokenResponse.access_token;
        // Save the access token securely (e.g., in a database)
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error exchanging public token');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
