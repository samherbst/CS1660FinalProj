// this will be some test data for the application, I will make a json list of events for a user to have
// and then I will test the application to see if it can display the events in the list

const user = {
    fname: "John",
    lname: "Doe",
    username: "johnnydoe123",
    uid: 1,
    jwt: "eyJhbGci"
}

const testData = {
    events: [
        {
            name: "Dentist Appointment",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Get a cavity filled at 123 main st by dr johnson",
            priority: "H"
        }
    ]
}