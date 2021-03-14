# [GADGET-MANIA](https://gadget-mania.herokuapp.com/)
The Fun Website I created during the Covid Lockdown period.

![Heroku](http://heroku-badge.herokuapp.com/?app=heroku-badge&root=projects.html)

# Key Features  
- Register a New User
- Add/Modify/Delete Gadget
- Can Customize Profile
- Change/Reset Password
- Add/Edit Comments

# Getting Started
For Running Locally
- Clone the repo
  ```
  git clone [git-url]
- ```npm install ```  to install all  dependencies
- Install MongoDB. Look for  [instruction](https://docs.mongodb.com/manual/installation/#tutorials) here.
- ``` node app.js ``` to run the application.
Note: to visit the site on Local server [http://localhost:3000]()-(3000 is your port number)


  
# Code Overview
## Dependencies
- [mongoose](https://mongoosejs.com/) - For modeling and mapping MongoDB data to javascript.
- [Cloudinary](https://cloudinary.com/?utm_source=google&utm_medium=cpc&utm_campaign=Rbrand&utm_content=394051365994&utm_term=cloudinary&gclid=CjwKCAiAnIT9BRAmEiwANaoE1UfngAiF5otZnbXMWY7Y_D-m2QBVt_2uSJn1hz0GUt1L-kz5qleq-hoCnWAQAvD_BwE) - For Image management over cloud.
- [Heroku](https://dashboard.heroku.com/) - For Deploying Application
- [mLab](https://mlab.com/)- For cloud-hosted database
- [Express.js](https://expressjs.com/) - Framework that with robust set of features for web  applications
- [Passport](http://www.passportjs.org/) - For handling User Authentication
- [Bootstrap](https://getbootstrap.com) - For quick design and responsive webpages.

## Application Structure
- ```app.js``` -The entry point for the application. It connects to the MongoDB using mongoose.
- ```routes```/ -This folder contains the route definitions for the site.
- ```models/ ```-This folder contains the schema definitions for our Mongoose models.
- ```middleware/``` -This folder contains the authentication files.

For environment varibales refer .env_sample

## Known Bugs :(

The Forget Password link sometimes doesnot works because of the security features of the Gmail Account. To send the Email Authentication need to be turned off.

-----------------

The Wesite is published on Heroku [https://gadget-mania.herokuapp.com/](https://gadget-mania.herokuapp.com/)

## Screenshots
![Homepage](/assets/screenshots/home.png)
![Homepage](/assets/screenshots/landing.png)
![Homepage](/assets/screenshots/signup.png)
![Homepage](/assets/screenshots/profile.png)
