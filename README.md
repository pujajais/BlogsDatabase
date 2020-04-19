# BlogsDatabase
Node.js, REST API,Mongo DB, read-line Sync
When the application is started, it displays the list of users and possible operations in a console menu like the following:

Main Menu

1) John Doe
2) Jane Doe
x) Exit
Please enter your choice:

We'll refer to this screen as the main menu. Entering a number would select the corresponding user, while x would end the program.

If a user is select, the application displays the user menu like the following:

User - John Doe

1) List the articles authored by the user
2) Change first name
3) Change last name
4) Change email
b) Back to Main Menu
Please enter your choice:

Based on the choice entered, the application performs the corresponding operation. For listing articles, only article titles should be displayed; for changing first name, last name, or email, the application should prompt for a new one.

The application must be implemented using Node.js and MongoDB.
