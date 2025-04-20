# Team Members: Don't forget to `git pull` before starting to contribute.

## What is this for?

- We are solving **Problem Code: WEB-002**, which intends to provide a solution for students (like Priya, as mentioned here), who have *strict budget contraint*. Basically, we aim to build an **expense tracker**.
- Now, We choose to build an app for this purpose, instead of a website as reaching to particular website and using it for tracking expenses can  be a bit upsetting, and demotivating, having an app which can send **occational reminders(like, seeting financial goals, alert on over-spending)** to us directly, solves the problem to a good extent.
- For this we need a bank service provider, as unfortunately none of the UPI-payment application don't provide access to **transaction-history**, we need a **payment mediator**, (we will think about that at the time of deploying this application, which service to use nas they are not free of use).
- This is the **backend, which simulates the real-lfe banking system**.

 ## How it works?
  
  - It is built in NodeJS environment, ande using expressJS for creating a server, which runs on PORT:8000.
  - It has the following endpoints:
    - / GET -> Provides a list of active user.
    - /?aadharId=<id> GET -> Provides only a specific user with provided id.
    - /addMoney/?aadharId=<id> POST -> Adds *provided money* to the specific user's account.
    - /deductMoney/?aadharId=<id> POST -> Deducts *provided money* to the specific user's account.
    - /total/?aadharId=<id> GET -> Shows the total amount of the specified user.

## Dependencies (`v:0.0.1`)
  
  - Express.js for creating server.
  - Mongoose for ORM.
  - MongoDB as database.
  - Nodemon - a dev dependency for restarting our server on every saved changes
 
 ### Team : Byte Bandits
