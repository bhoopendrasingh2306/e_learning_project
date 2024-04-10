# Aeonaxy backend project

<p>
  <h3>  ## Project Overview</h3>
The goal of this project is to develop a robust backend API for an e-learning platform. The API will facilitate user registration, user profile management, course management (including CRUD operations for superadmin), and user enrollment functionalities. Additionally, the courses API will implement filtering and pagination to enhance user experience. The project will utilize the free tier of neon.tech database for data storage and [resend.com] http://resend.com/ free tier for handling email communications.
</p>
<br>
<p>
  <h3>PROJECT ARCHITECTURE</h3>
  The project is about the backend API for an e-learning platform. The super Admin holds the authority to introduce the courses . The super admin can add, delete, update and get the courses. The admin performs all CRUD operations on the courses. <br>
  The user will register himself , login.  The user can access any of the courses. User can't enroll in the same course multiple times.<br>
  User enrollment is the process of enrolling the user into a course created by super admin . 
</p>
<br>
<p>
  <h3>KEY POINTS</h3>
  ->  JWT (json web token) authorization is used .<br>
  ->  bcrypt is used for password hashing for user. <br>
  -> password and email validation is also implemented for user.<br>
  -> an email will be sent while user registration , profile upgradation, and user enrollment with the help of resend.com. <br>
  -> various filters are also available to filter the courses .<br>
  -> Error handling is done.<br>
  -> user Profile can be accessed and updated<br>
  
</p>
<br>
<p>
  <h3>folder architecture</h3>
  ![Screenshot 2024-04-11 000903](https://github.com/bhoopendrasingh2306/e_learning_project/assets/123774314/353e8ba1-d8be-424f-9747-1aaeb4601dc1)
</p>
<br>
<p>
  <h3>Database design and workflow</h3>
  ---> database design<br>
  ![Screenshot 2024-04-11 000744](https://github.com/bhoopendrasingh2306/e_learning_project/assets/123774314/c5b4d730-698e-40d0-a9a4-d0820642eaef)
  <br>-->workflow<br>
![Screenshot 2024-04-11 000352](https://github.com/bhoopendrasingh2306/e_learning_project/assets/123774314/5b030f73-9362-4c81-897d-9906155a3855)
</p>
