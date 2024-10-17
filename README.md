# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

You can visit this api here --> https://be-nc-news-upc8.onrender.com/api

In this repository I built an API for the purpose of accessing application data programmatically. The intention here was to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture. My database was PostgreSQL, I interacted with it using node-postgres. I used TDD to build each endpoint, ensuring that they function as intended and handle any errors appropriately.

To clone this repo, fork the repo, then clone it locally. 

In order to run this project you will need to install 
- as devDependencies: jest, jest-extended, jest-sorted and supertest 
- as dependencies: dotenv, express, pg and pg-format

In order to run this project locally you will need to create the following files: 
    .env.test - connects to the test database using PGDATABASE=nc_news_test
    .env.development - connects to the development database using PGDATABASE=nc_news

To setup the database use command 'npm run setup-dbs'
To seed the data use command 'npm run seed'
To run tests used command 'npm test'
To see the data in the tables use 'npm check' and then navigate to the check.txt file in the root of the repo

Postgres should be v9.5+.
Node should be >=v6.9.0
