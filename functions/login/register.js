'use strict';

const user = require('../../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = (name, email, password, age, city,image ) =>

	new Promise((resolve,reject) => {


        user.find({email: email})
            .then(users => {
                if (users.length == 0) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    const newUser = new user({
                        name: name,
                        email: email,
                        age: age,
                        city: city,
                        image:image,
                        hashed_password: hash,
                        created_at: new Date()

                    });

                    newUser.save()
                        .then(() => resolve({ status: 200, message: 1}))

                        .catch(err => {

                            if (err.code == 11000) {
                                reject({ status: 200, message: 'User Already Registered !' });

                            } else {
                                console.log(err.message);
                                reject({ status: 200, message: 'Internal Server Error !'+err.message });
                            }
                        });

                } else {
                    reject({ status: 200, message: 0 });
                }
            });
	});

exports.getAllAcount=(search)=>new Promise((resolve,reject)=>{
    user.find({name:new RegExp('^' +search + '.*$', 'i')}, 'name image', function(err, someValue){
        if(err) return next(err);
        resolve({ status: 200, message: someValue });
    });
})