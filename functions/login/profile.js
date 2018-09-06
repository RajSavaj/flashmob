'use strict';

const user = require('../../models/user');

exports.getProfile = email => 

	new Promise((resolve,reject) => {

		user.find({ email: email }, {image:1, name: 1, email: 1, created_at: 1,age :1,city:1, _id: 1 })

		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

});

exports.resetPasswordFinish = (email, token, password) =>

    new Promise((resolve, reject) => {

        user.find({ email: email })
            .then(users => {
                let user = users[0];

                const diff = new Date() - new Date(user.temp_password_time);
                const seconds = Math.floor(diff / 1000);
                console.log(`Seconds : ${seconds}`);

                if (seconds < 600) { return user; } else { reject({ status: 200, message: 0 }); } }) .then(user => {

            if (bcrypt.compareSync(token, user.temp_password)) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                user.hashed_password = hash;
                user.temp_password = undefined;
                user.temp_password_time = undefined;
                return user.save();

            } else {

                reject({ status: 200, message: 1 });
            }
        })

            .then(user => resolve({ status: 200, message: 2 }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !'+err.message }));

    });
exports.userupdate = (email,name,city,age,image) =>

    new Promise((resolve, reject) => {

        user.find({ email: email })
            .then(users => {
                let user = users[0];
                user.name = name;
                user.age=age;
                user.city=city;
                if(image!=""){
                    user.image=image;
                }

                return user.save();
            })
            .then(user => resolve({ status: 200, message: user }))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !'+err.message }));

    });
