import express from 'express';
import bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import jwt from 'jsonwebtoken';

const app = express();
app.use(bodyParser.json());

const client = new SecretManagerServiceClient();

let MY_JWT_SECRET;

// HELPER FUNCTIONS:

// Returns jwt secret
async function getSecret() {
    const [version] = await client.accessSecretVersion({
      name: 'projects/cs1660-finalproj/secrets/jwt-secret/versions/latest'
    });
    return version.payload.data.toString('utf8');
  }

// verifies the jwt
function verifyJWT(token, uid) {
    try {
        const decoded = jwt.verify(token, MY_JWT_SECRET);
        return decoded.uid === uid;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return false;
    }
}

// TODO: Implement function to authenticate the user with the database
async function authenticateUser(username, password){

}



// CLOUD FUNCTIONS:

app.post('/register', (req, res) => {
    const { username, password, fname, lname } = req.body;
    // TODO: Add database logic 

    res.status(200).json({ success: true });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Placeholder for authentication logic
    const user = await authenticateUser(username, password);

    if (!MY_JWT_SECRET) {
        MY_JWT_SECRET = await getSecret();
    }

    if (user) {
        const token = jwt.sign(
            {
                uid: user.uid,
                username: user.username
            },
            MY_JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            jwt: token,
            uid: user.uid,
            fname: user.fname,
            lname: user.lname,
            username: user.username
        });
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    }
});

app.post('/createEvent', async (req, res) => {
    
    const { jwt: token, uid, starttime, endtime, name, desc, priority, eid } = req.body;

    // Verify JWT
    if(!verifyJWT(token,uid)){
        return res.status(401).json({ success: false });
    }

    // TODO: Add event in database

    return res.json({ success: true });
});

app.post('/updateEvent', async (req, res) => {
    
    const { jwt: token, uid, starttime, endtime, name, desc, priority, eid } = req.body;

    // Verify JWT
    if(!verifyJWT(token,uid)){
        return res.status(401).json({ success: false });
    }

    // TODO: Update event in database

    return res.json({ success: true });
});


app.post('/deleteEvent', async (req, res) => {
    
    const { jwt: token, uid, eid } = req.body;

    // Verify JWT
    if(!verifyJWT(token,uid)){
        return res.status(401).json({ success: false });
    }

    // TODO: Delete event in database

    return res.json({ success: true });
});


app.post('/getEvents', async (req, res) => {
    
    const { jwt: token, uid} = req.body;

    // Verify JWT
    if(!verifyJWT(token,uid)){
        return res.status(401).json({ success: false });
    }

    // TODO: Get all events from database

    return res.json({ success: true });
});

export const register = functions.https.onRequest(app);
export const login = functions.https.onRequest(app);
export const createEvent = functions.https.onRequest(app);
export const updateEvent = functions.https.onRequest(app);
export const deleteEvent = functions.https.onRequest(app);
export const getEvents = functions.https.onRequest(app);
