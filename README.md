# Splat World Server Documentation

## Node code

## SQL Database

## Minio Object Storage

## Linux Reference and SSH
### Local Testing Environment  

#### NPM scripts  
In gulpFile.js, you can find a couple scripts used to automate the building, linting, and watching files in nodemon.   

`jsTask`
jsTask takes the .jsx React files and runs them through webpack, which makes them smaller and more efficient. 

`lintTask`
lintTask runs all of our code through eslint, automatically modifying it where it can so that our code meets the Airbnb code linting standards. 

`build`
build runs jsTask and lintTask in parallel. 

`watch`
watch observes our files for changes, and then tells nodemon to restart the live running version of our code. 


#### SQL Server
To set up the local SQL Server, you need to install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) and [MySQL](https://dev.mysql.com/downloads/mysql/). Once you've done that, you can create the schema/database splat_world, and use the [swdb.sql](server/sql/swdb.sql) file to set up the tables. I recommend using [W3School's MySQL reference](https://www.w3schools.com/mysql/) because it makes more sense than the actual MySQL documentation. Your SQL database starts up when your computer starts up, so you never have to worry about starting it up before running your local code.

#### Minio Object Storage
Min.IO on the other hand, will need to be run before you start testing your code, otherwise your code will not be able to interact with it. Inside of your 

### Capsul Server
#### Docker

### MAGIC Server

