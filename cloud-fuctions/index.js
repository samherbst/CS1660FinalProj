import express from 'express';
import bodyParser from 'body-parser';
import * as functions from 'firebase-functions';

const app = express();
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { username, password, fname, lname } = req.body;
    // Add database logic 

    res.status(200).json({ success: true });
});

export const register = functions.https.onRequest(app);