
# Express-Sequelize-API comptalib

This is a simple test for creating CRUD APIs with NodeJs express framework.

Here API access token encapsulated/encrypted with JWT token based system.

- Sample API ready for login

- API middlewares for normal delete and update user

## Getting Started

You can download this repo or clone using below command. (folder-name will be project folder in which you want to start your project).

```
git clone https://github.com/ThomasRolland/comptalib.git <folder-name>
```

or from **Download Zip**

```
https://github.com/ThomasRolland/comptalib.git
```

### Project Setup

Once you clone or download project go into you folder

### Installing

```

> npm install or yarn install (this will install all dependent libraries)

```



### Database Config Setup

Create new database (let's say i'm going to use mysql and my database name is **comptalib**).

so in my **.config/config.js** file will set below parameters.

```
test: {  
  "username": "root",   # database username
  "password": "",  # database password
  "database": "comptalib", # database name  
  "port": 25060,  # database port
  "host": "127.0.0.1", # database connection host
  "SECRET_KEY": "test_comptalib",
  "dialect": "mysql",  # database dialect
},
```


### Migration and Seeders run

After creating database and updating .config/config.js file run below commands

`npm start` to run your project

## Middlewares

```
> YourSelfOnly this will check admin auth and it's access for this request.

```



## Routing files

> Currently we have added 2 routing files

```

> user.js # public routing access everyone can access this APIs

> company.js # public routing access everyone can access this APIs

```


### Login

```

> POST : http:localhost/user/login

> Payload: username, password

> Response :

{

"code": 200,

"data": {

"id": 2,

"username": "test",

"password": "$2a$10$8u0BHmU8Heo2.qhvulJEie6PwjG6XOAT.O.KaR7YUsQ8KbwrZ5Goi",

"updatedAt": "2021-09-16T10:32:51.954Z",

"createdAt": "2021-09-16T10:32:51.954Z",

"oauth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyLCJpYXQiOjE2MzE3ODQ3NzEsImV4cCI6MTYzMTk1NzU3MX0.dulgha-Fc67kRuE1zGRqV_2sYcJXjRTedIWeBWtepEU"

},

"message": ""

}

```

### Login

You can find one documantation make with Swagger here:
```
http://localhost/api/v1/doc/
```
