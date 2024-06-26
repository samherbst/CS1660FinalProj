// file to create functions that make calls to the apis so that the main code is cleaner

const url = "https://us-central1-cs1660-finalproj.cloudfunctions.net"

async function makeApiCall(endpoint, method, body) {
    try {
        const response = await fetch(url + endpoint, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response:', response); // Log response object

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data:', data); // Log response data
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error
    }
}

export async function apiCallLogin(username, password) {
    let body = {
        username: username,
        password: password
    };
    
    return makeApiCall("/login/login", "POST", body);
}

export async function apiCallRegister(username, password, fname, lname, email) {
    let body = {
        username: username,
        password: password
    };

    try {
        const response = await makeApiCall("/register/register", "POST", body);

        console.log('debug response:', response);

        if (response.ok || response.success) {
            return { success: true, message: "Registration successful!" };
        } else {
            if (response.code === 500){
                return { success: false, message: "Username already exists." };
            }
            else if (response.code >= 400 && response.code < 500){
                return { success: false, message: "IDFK." };
            }
            return { success: false, message: response.message };
        }
    } catch (error) {
        // Handle any errors from makeApiCall
        console.error('Error:', error);
        return { success: false, message: "An error occurred during registration." };
    }
}

export function apiCallToGetEvents(uid, jwt) {    
    let body = {
        uid: uid,
        jwtToken: jwt
    };
    return makeApiCall("/getEvents/getEvents", "POST", body);
}

export function apiCallToChangeEvent(updatedEvent) {
    return makeApiCall("/updateEvent/updateEvent", "POST", updatedEvent);
}

export function apiCallToCreateEvent(newEvent) {
    return makeApiCall("/createEvent/createEvent", "POST", newEvent);
}

export function apiCallToDeleteEvent(uid, jwt, eventId) {
    console.log("hello??");
    let body = {
        uid: uid,
        jwtToken: jwt,
        eid: eventId
    };
    return makeApiCall("/deleteEvent/deleteEvent", "POST", body);
}