// this will be some test data for the application, I will make a json list of events for a user to have
// and then I will test the application to see if it can display the events in the list

export const user = {
    fname: "John",
    lname: "Doe",
    username: "johnnydoe123",
    uid: 1,
    jwt: "eyJhbGci"
}

export const testData = {
    events: [
        {
            name: "Dentist Appointment",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Get a cavity filled at 123 main st by dr johnson",
            priority: "H"
        },
        {
            name: "Meeting with boss",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Discuss the new project and the deadline",
            priority: "M"
        },
        {
            name: "Lunch with friends",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Go to the new burger place in town",
            priority: "L"
        },
        {
            name: "Grocery Shopping",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Buy milk, eggs, and bread",
            priority: "L"
        },
        {
            name: "Workout",
            starttime: 1713890200,
            endtime: 1713893800,
            desc: "Go to the gym and do a full body workout",
            priority: "M"
        }
    ]
}