// server.js
const express = require('express');
const plaid = require('plaid');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Plaid client
const client = new plaid.Client({
    clientID: 'YOUR_CLIENT_ID',
    secret: 'YOUR_SECRET',
    env: plaid.environments.sandbox, // Use sandbox for testing
});

// Store access tokens (ideally in a database)
let userAccessTokens = {};

// Endpoint to get link token
app.post('/get_link_token', async (req, res) => {
    try {
        const response = await client.createLinkToken({
            user: {
                client_user_id: req.body.user_id, // A unique identifier for the user
            },
            client_name: 'Your Budget Manager',
            products: ['transactions', 'auth'],
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
    const { public_token, user_id } = req.body;
    try {
        const tokenResponse = await client.exchangePublicToken(public_token);
        const accessToken = tokenResponse.access_token;
        
        // Save the access token for the user
        userAccessTokens[user_id] = accessToken;
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error exchanging public token');
    }
});

// Endpoint to fetch transactions
app.post('/transactions', async (req, res) => {
    const { user_id } = req.body;
    const accessToken = userAccessTokens[user_id];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Fetch transactions from the last 3 months

    try {
        const response = await client.getTransactions(accessToken, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
