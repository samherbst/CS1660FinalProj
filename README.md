# CS1660FinalProj
## Overview: <br>
This project was focused on developing a user-friendly task scheduling application where users can create new tasks with descriptions, date, start-time, end-time and priority levels. The application also facilitates task deletion and modification, ensuring users can maintain a dynamic and up-to-date schedule. Furthermore, the application functions on an account-based system. This requires users to create an account for access and management of tasks.
## Google Cloud Services Used: <br>
## Division of Work: <br>
> **Shivani Praveen**: I helped establish the project's data foundation by utilizing Google Cloud SQL to design and implement a relational database for storing the user and task information by defining the database schema and creating the necessary tables within the Cloud SQL database. <br> <br>
> **Sam Herbst**: Wrote, deployed, tested cloud functions using the Google Cloud Function service. This involved ensuring http access to the functions to allow the frontend of our project to call and execture the functions. They needed to take input from frontend requests and then query the database to perform certain actions and return the necessary information. This also involved creating a jwt secret, verifying and creating jwt tokens, and managing authorization for requests using Google Cloud's Secret Manager Service. Lastly, I had to ensure that our functions aligned with the database schema that we had created. I tested this part by using Cloud SQL studio to ensure our database was working properly with the querys I needed to perform as well as using Postman to ensure the functions could execute and return to correct information from the frontends perspective. Overall, by implementing and testing these functions I created an API service that allowed our frontend user interface to communicate with and query our SQL databse. <br> <br>
> **Owen Wurst**: <br>
> **Oliver Gladys**: <br>
> **Nicholas Giannetta**: <br>
