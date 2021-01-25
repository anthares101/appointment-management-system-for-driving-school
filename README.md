<img alt="GitHub" src="https://img.shields.io/badge/version-v1.0.0-blue"> <img alt="GitHub" src="https://img.shields.io/github/license/anthares101/appointment-management-system-for-driving-school">

# Metro School [Spanish version]

This is an open source appointment management system for driving schools. In this system, you can manage students, appointments, cars and instructors.

## Deploy

Install docker and docker-compose in your system and execute:

```
docker-compose up
```

## Creating a user

To create a user you will need to enter the backend container using:

```
docker exec -it appointment-management-system-for-driving-school_backend_1 sh
```

And use the `db_scripts/create_user.js` script with `node ./db_scripts/create_user.js`. Remember to edit this file to change the password and user name before executing it.

## Tech Stack

+ Node.js
+ React
+ GraphQL
+ Rethinkdb

## Todo

The server use moment.utcOffset("+01:00") to return result of CET time zone result. This won't work for people not in CET zone. Possible solution: store timezone in user object.
