// file to create functions that make calls to the apis so that 

import {testData, user} from './test/testData.js';

export function apiCallToGetEvents(uid, jwt) {    
    return testData;
}

export function apiCallLogin(username, password) {
    if (username === "test" && password === "test") {
        return "fail";
    }
    
    return user;
}

export function apiCallRegister(username, password, fname, lname, email) {
    if (username === "test") {
        return {
            success: false,
            message: "Username already exists"
        };
    } else {
        return {
            success: true
        }
    };
}

export function apiCallToChangeEvent(uid, jwt, eventId, newEvent) {

}

export function apiCallToCreateEvent(uid, jwt, newEvent) {
    
}

export function apiCallToDeleteEvent(uid, jwt, eventId) {

}