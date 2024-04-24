import express from 'express';
import bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const app = express();
app.use(bodyParser.json());


// CLOUD FUNCTIONS:

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

app.post('/deleteEvent', async (req, res) => {

    const { jwt: token, uid, eid } = req.body;

    // Verify JWT
    if (!verifyJWT(token, uid)) {
        return res.status(401).json({ success: false });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        const config = {
            user: 'developer',
            password: 'cs1660',
            database: 'user_info',
            socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase',
        };
        connection.query('DELETE FROM events WHERE eid = ?, uid = ?', [eid, uid], (error, results) => {
            connection.release(); // Release connection back to the pool

            if (error) {
                console.error('Error executing SQL query:', error);
                return res.status(500).json({ error: 'Failed to delete event' });
            }

            // Event deletion successful
            res.status(200).json({ success: true });
        });
    });
    return res.json({ success: true });
});


app.post('/getEvents', async (req, res) => {

    const { jwt: token, uid } = req.body;

    // Verify JWT
    if (!verifyJWT(token, uid)) {
        return res.status(401).json({ success: false });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        const config = {
            user: 'developer',
            password: 'cs1660',
            database: 'user_info',
            socketPath: '/cloudsql/cs1660-finalproj:us-east1:taskdatabase',
        };
        connection.query('SELECT * FROM events WHERE uid = ?', [uid], (error, results) => {
            connection.release(); // Release connection back to the pool

            if (error) {
                console.error('Error executing SQL query:', error);
                return res.status(500).json({ error: 'Failed to retrieve events' });
            }

            // Event retrieval successful
            res.status(200).json({ success: true });
        });
    });
    return res.json({ success: true });
});

export const register = functions.https.onRequest(app);
export const login = functions.https.onRequest(app);
export const createEvent = functions.https.onRequest(app);
export const updateEvent = functions.https.onRequest(app);
export const deleteEvent = functions.https.onRequest(app);
export const getEvents = functions.https.onRequest(app);
