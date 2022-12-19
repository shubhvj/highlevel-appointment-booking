# highlevel-appointment-booking

BACKEND - 
There are 3 endpoints.
1. GET - /slots?startDate=1671421971662&endDate=1675103400000&timezone
    This endpoint will get all the avialable slots.
2. POST - /
    This endpoint will save an appointment.
3. GET - /events?startDate=1671439748156&endDate=1672425000000 - THIS IS NOT INTEGRATED WITH UI.
    This endpoint will get the slots for a date range.

Database contains 1 collection "events". Below is tha snapshot of database.

<img width="1151" alt="Screenshot 2022-12-19 at 4 50 53 PM" src="https://user-images.githubusercontent.com/26573621/208414914-30e8d326-c9d0-4e4c-ac60-707e7553f405.png">

I am querying the data by comparing the year and month to get all the slots for a month and display accordingly on UI.
JSON collection is added for referencing the REQUESTs.


Project setup doesn't require anything. .env file is added for this DEMO.

for client - run 'npm run serve'
for servr - run 'npm run dev' or 'npm start' - nodemon is used for DEV.
