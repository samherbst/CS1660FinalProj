# CS1660FinalProj
## Overview: <br>
This project was focused on developing a user-friendly task scheduling application where users can create new tasks with descriptions, date, start-time, end-time and priority levels. The application also facilitates task deletion and modification, ensuring users can maintain a dynamic and up-to-date schedule. Furthermore, the application functions on an account-based system. This requires users to create an account for access and management of tasks.
## Google Cloud Services Used: <br>
**Cloud SQL**: This project leveraged Cloud SQL, a managed relational database service by GCP, to establish a secure and well-structured database. Two primary tables were created: <br>
> **User Table:** This table stores user information essential for login and access control. It includes columns for user ID (unique identifier), username, and password.Having this user data allows the application to verify user accounts during login attempts, ensuring only authorized users can access and manage their tasks.<br>
> **Task Table:** This table houses all task-related data. It includes columns for task ID (unique identifier), task name, description, date, start time, end time, and priority level. Notably, the User ID from the User table is included as a foreign key within the Task table. This foreign key relationship ensures data integrity and consistency. By referencing a valid User ID, it prevents stand-alone tasks and guarantees each task is associated with a specific user. Furthermore, the Task table structure facilitates various functionalities. Tasks can be fetched based on the User ID, allowing users to view, update, or delete their specific tasks. Additionally, storing tasks within the database ensures data persistence, meaning tasks are saved and accessible in subsequent logins. <br> <br>

**Cloud Functions**: This project required the use of cloud functions to connect various cloud components specifically the frontend to the database.  Each function served a unique purpose and each is described in more detail below.<br>
> **/register:** Handles HTTP POST requests to '/register' endpoint for user registration.  This function allows new users to create an account on the website by providing their desired credentials(username and password) and then they are stored securely in the database.<br>
> **/login:** Handles HTTP POST requests to '/login' endpoint for user authentication.  This function allows users to login to their created account with their unique credentials (username and password). The username and password are checked against the username and passwords stored within the database of valid accounts.  If the username and its associated password is not found within the database, then the authencation fails and the user will not be able to login.  If the username and its associated password is found, then the user will be authenticated and they will be able to login to their account.  The user once authenticated is issued a JWT for 24hrs and once the 24hrs expire, the user will have to reauthenticate their account by logging in with valid credentials.  Then they will be reissued a new JWT token if their account is properly authenticated.<br>
> **/createEvent:** Handles HTTP POST requests to '/createEvent' endpoint for a user to create events.  This function allows a authenticated user to create an event and store it in the database.<br>
> **/updateEvent:** Handles HTTP POST requests to '/updateEvent' endpoint for a user to update events.  This function allows a authenticated user to update an existing event and then store it in the database.<br>
> **/deleteEvent:** Handles HTTP POST requests to '/deleteEvent' endpoint for a user to delete events.  This function allows a authenticated user to delete an existing event by removing it from the database.<br>
> **/getEvents:** Handles HTTP POST requests to '/getEvents' endpoint for user events. This function allows an authenticated user to view all the events they have previously created which are stored in the database.
<br><br>

**Google App Engine:**:  We used Google App Engine to deploy our React application.  App Engine is a Platform as a Service (PaaS) which made hosting our application much more convenient the using Google Cloud Engine.  If we alternatively used Cloud Engine, we would have had to spend much more time configuring our deployment.  With App Engine, we simply needed to clone our repositoty and specify which version of Node.js we were using.  
>Steps:
>1.) Cloned our repository into GCP
>2.) Did proper npm installation
>3.) Ran npm build bundle, compile, and optimize our source code
>5.) Deployed our application

**Secret Manager**: Utilized gcp's secret manager to securely store our java web token secret. This allowed us to access the secret whenever we needed to sign and create jwts to provided users logging in to the application to them with proper authentication. The secret manager allowed us to have a centralized spot to securely store the secret where we could manage access and could integrate with other cloud services.
<br><br> 


## Division of Work: <br>
> **Shivani Praveen**: I helped establish the project's data foundation by utilizing Google Cloud SQL to design and implement a relational database for storing the user and task information by defining the database schema and creating the necessary tables within the Cloud SQL database. <br> <br>
> **Sam Herbst**: Wrote, deployed, tested cloud functions using the Google Cloud Function service. This involved ensuring http access to the functions to allow the frontend of our project to call and execture the functions. They needed to take input from frontend requests and then query the database to perform certain actions and return the necessary information. This also involved creating a jwt secret, verifying and creating jwt tokens, and managing authorization for requests using Google Cloud's Secret Manager Service. Lastly, I had to ensure that our functions aligned with the database schema that we had created. I tested this part by using Cloud SQL studio to ensure our database was working properly with the querys I needed to perform as well as using Postman to ensure the functions could execute and return to correct information from the frontends perspective. Overall, by implementing and testing these functions I created an API service that allowed our frontend user interface to communicate with and query our SQL databse. <br> <br>
> **Owen Wurst**: Made the original diagrams/specifications for the system and laid out architecture. Built the react app that serves as the frontend and integrated it with the cloud functions.<br>
> **Oliver Gladys**:  I focused on developing some components for the cloud functions, particularly in interfacing with databases, conducting some testing, and providing function descriptions.<br>
> **Nicholas Giannetta**: I managed the deployment of the React appliaction over Google Cloud Platform (GCP).  I then worked on writing a .yaml file to automate continuous integration for my group.  I also took part in styling the primary page of the react application using CSS.
