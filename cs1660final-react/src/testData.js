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
    eventlist: [
        {
            name: "Dentist Appointment",
            starttime: "07:00:00",
            endtime: "08:00:00",
            descr: "Get a cavity filled at 123 main st by dr johnson",
            priority: "H",
            Date: "2024-04-23T00:00:00.000Z",
            eid: 1
        },
        {
            name: "Meeting with boss",
            starttime: "12:00:00",
            endtime: "09:00:00",
            descr: "Discuss the new project and the deadline",
            priority: "M",
            Date: "2024-04-23T00:00:00.000Z",
            eir: 2
        },
        {
            name: "Lunch with friends",
            starttime: "09:00:00",
            endtime: "10:00:00",
            descr: "Go to the new burger place in town",
            Date: "2024-04-23T00:00:00.000Z",
            priority: "L",
            eid: 3
        },
        {
            name: "Grocery Shopping",
            starttime: "08:30:00",
            endtime: "09:00:00",
            descr: "Buy milk, eggs, and bread",
            priority: "L",
            Date: "2024-04-23T00:00:00.000Z",
            eid: 4
        },
        {
            name: "Workout",
            starttime: "18:00:00",
            endtime: "19:00:00",
            descr: "Go to the gym and do a full body workout",
            priority: "M",
            Date: "2024-04-23T00:00:00.000Z",
            eid: 5
        }
    ]
}

