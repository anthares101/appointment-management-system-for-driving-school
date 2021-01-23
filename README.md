# Driving school appointment management system

This is an open source appointment management system for driving schools. In this system, you can manage students, appointments, cars and instructors.

## Demo

Url: https://metro.stevemu.com

Username: admin

Password: demo


## Tech Stack

+ Node.js
+ React
+ GraphQL
+ Rethinkdb

## Todo

The server use moment.utcOffset("+01:00") to return result of CET time zone result. This won't work for people not in CET zone. Possible solution: store timezone in user object.