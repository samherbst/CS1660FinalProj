import express from 'express';
import bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const app = express();
app.use(bodyParser.json());


// CLOUD FUNCTIONS:

/**
 * Description: Handles HTTP POST requests to '/register' endpoint for user registration.
 * This function allows new users to create an account on the website by providing their
 * desired credentials(username and password) and then they are stored securely in the 
 * database.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/register', async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    const { username, password } = req.body;

    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });
    
    try{
        // Save the user in the database
        const conn = await pool.getConnection();

        const queryText = 'INSERT INTO user_info(username, user_password) VALUES(?, ?)';
        const result = await conn.query(queryText, [username, password]);
        conn.release();

        res.status(200).json({ success: true });
    } catch (error){
        console.error('Database error:', error);
        res.status(500).json({ success: false , error: error});
        if (conn) conn.release();
    }
});

/**
 * Description: Handles HTTP POST requests to '/login' endpoint for user authentication.
 * This function allows users to login to their created account with their unique 
 * credentials (username and password). The username and password are checked against
 * the username and passwords stored within the database of valid accounts.  If the
 * username and its associated password is not found within the database, then the
 * the authencation fails and the user will not be able to login.  If the username and
 * its associated password is found, then the user will be authenticated and they will
 * be able to login to their account.  The user once authenticated is issued a JWT for
 * 24hrs and once the 24hrs expire, the user will have to reauthenticate their account
 * by logging in with valid credentials.  Then they will be reissued a new JWT token
 * if their account is properly authenticated.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });

    try{

        const conn = await pool.getConnection();

        const queryText = 'SELECT * FROM user_info WHERE username = ? AND user_password = ?';
        const [rows] = await conn.query(queryText, [username,password]);
        conn.release();

        // if nothing returned, no matching username and password
        if(rows.length === 0){
            res.status(401).json({ error: 'Authentication failed' });
            return;
        }

        const user = rows[0];

        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: 'projects/276748369389/secrets/jwt-secret/versions/latest'
        });
        const MY_JWT_SECRET = version.payload.data.toString('utf8');

        // create jwt token
        const token = jwt.sign(
        { id: user.userID, username: user.username },
        MY_JWT_SECRET,
        { expiresIn: '24h' }
        );

        res.status(200).json({
            jwt: token,
            uid: user.userID,
            username: user.username
        });

    } catch (error){
        console.error('Database connection error:', err);
        res.status(500).json({ msg: "Error here", error: error });
        if (conn) conn.release();
    }
});
/**
 * Description: Handles HTTP POST requests to '/createEvent' endpoint for a user to create
 * events.  This function allows a authenticated user to create an event and store it  
 * in the database.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/createEvent', async (req, res) => {
    const { jwtToken, uid, starttime, endtime, date, name, desc, priority} = req.body;

    // verify JWT
    try {
        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: 'projects/276748369389/secrets/jwt-secret/versions/latest'
        });
        const MY_JWT_SECRET = version.payload.data.toString('utf8');

        const decoded = jwt.verify(jwtToken, MY_JWT_SECRET);
        if (decoded.id !== uid) {
            res.status(403).json({ success: false, message: 'Unauthorized' , jwtPayload: decoded, uid: uid});
            return;
        }
    } catch (error) {
        res.status(401).json({ success: false, error: error });
        return;
    }

    // connect to cloud database
    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });

    try{
        const conn = await pool.getConnection();
        const queryText = `INSERT INTO task_info (UserID, StartTime, EndTime, TaskName, Description, Date, Priority) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [results] = await conn.query(queryText, [uid, starttime, endtime, name, desc, date, priority]);
        conn.release();

        res.status(200).json({ success: true })

    } catch (error){
        console.error('Database error:', dbError);
        res.status(500).json({ success: false, message: error });
    }
});
/**
 * Description: Handles HTTP POST requests to '/updateEvent' endpoint for a user
 * to update events.  This function allows a authenticated user to update an existing
 * event and then store it in the database.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/updateEvent', async (req, res) => {

    const { jwtToken, uid, starttime, endtime, date, name, desc, priority, eid} = req.body;

    // verify JWT
    try {
        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: 'projects/276748369389/secrets/jwt-secret/versions/latest'
        });
        const MY_JWT_SECRET = version.payload.data.toString('utf8');

        const decoded = jwt.verify(jwtToken, MY_JWT_SECRET);
        if (decoded.id !== uid) {
            res.status(403).json({ success: false, message: 'Unauthorized' , jwtPayload: decoded, uid: uid});
            return;
        }
    } catch (error) {
        res.status(401).json({ success: false, error: error });
        return;
    }


    // connect to cloud database
    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });

    try{
        const conn = await pool.getConnection();
        const queryText = `UPDATE task_info SET StartTime = ?, EndTime = ?, TaskName = ?, Description = ?, Date = ?, priority = ? WHERE taskID = ? AND userID = ?`;
        const [results] = await conn.query(queryText, [starttime, endtime, name, desc, date, priority, eid, uid]);
        conn.release();

        res.status(200).json({ success: true })

    } catch (error){
        console.error('Database error:', dbError);
        res.status(500).json({ success: false, message: error });
    }

});
/**
 * Description: Handles HTTP POST requests to '/deleteEvent' endpoint for a user
 * to delete events.  This function allows a authenticated user to delete an existing
 * event by removing it from the database.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/deleteEvent', async (req, res) => {
    const { jwtToken, uid, eid } = req.body;

    // verify JWT
    try {
        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: 'projects/276748369389/secrets/jwt-secret/versions/latest'
        });
        const MY_JWT_SECRET = version.payload.data.toString('utf8');

        const decoded = jwt.verify(jwtToken, MY_JWT_SECRET);
        if (decoded.id !== uid) {
            res.status(403).json({ success: false, message: 'Unauthorized' , jwtPayload: decoded, uid: uid});
            return;
        }
    } catch (error) {
        res.status(401).json({ success: false, error: error });
        return;
    }

    // connect to cloud database
    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });

    try{
        const conn = await pool.getConnection();
        const queryText = `DELETE FROM task_info WHERE TaskID = ? AND UserID = ?`;
        const [results] = await conn.query(queryText, [eid,uid]);
        conn.release();

        res.status(200).json({ success: true })

    } catch (error){
        console.error('Database error:', dbError);
        res.status(500).json({ success: false, message: error });
    }

});

/**
 * Description: Handles HTTP POST requests to '/getEvents' endpoint for user events.
 * This function allows an authenticated user to view all the events they have 
 * previously created which are stored in the database.
 * 
 * @param {Object} req - The HTTP request object containing user input data.
 * @param {Object} res - The HTTP response object for sending back a response to the client.
 */
app.post('/getEvents', async (req, res) => {

    const { jwtToken, uid } = req.body;

    // verify JWT
    try {
        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: 'projects/276748369389/secrets/jwt-secret/versions/latest'
        });
        const MY_JWT_SECRET = version.payload.data.toString('utf8');

        const decoded = jwt.verify(jwtToken, MY_JWT_SECRET);
        if (decoded.id !== uid) {
            res.status(403).json({ success: false, message: 'Unauthorized' , jwtPayload: decoded, uid: uid});
            return;
        }
    } catch (error) {
        res.status(401).json({ success: false, error: error });
        return;
    }

    // connect to cloud database
    const pool = mysql.createPool({
        user: 'developer',
        password: 'cs1660',
        database: 'user_info',
        socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase'
    });

    try{
        const conn = await pool.getConnection();
        const queryText = `SELECT taskID AS eid, StartTime AS starttime, EndTime AS endtime, Date, TaskName AS name, Description AS descr, priority FROM task_info WHERE userID = ?`;
        const [events] = await conn.query(queryText, [uid]);
        conn.release();

        res.status(200).json({ eventlist: events })

    } catch (error){
        console.error('Database error:', dbError);
        res.status(500).json({ success: false, message: error });
    }

});

export const register = functions.https.onRequest(app);
export const login = functions.https.onRequest(app);
export const createEvent = functions.https.onRequest(app);
export const updateEvent = functions.https.onRequest(app);
export const deleteEvent = functions.https.onRequest(app);
export const getEvents = functions.https.onRequest(app);
