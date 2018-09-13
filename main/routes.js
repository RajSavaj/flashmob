'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const register = require('../functions/login/register');
const login = require('../functions/login/login');
const profile = require('../functions/login/profile');
const password = require('../functions/login/password');
const config = require('../config/config.json');
const party=require('../functions/party');
const freq=require('../functions/friendreq');
const chat=require('../functions/partychat');
const pimg=require('../functions/partyImage');
const music=require('../functions/partyMusic');
const musiclike=require('../functions/musiclike');
const stepcount=require('../functions/stepcount');
const multer = require('multer');

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/Images");
    },
    filename: function (req, file, callback) {
        callback(null,file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count


var MusicStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/Music");
    },
    filename: function (req, file, callback) {
        callback(null,file.originalname);
    }
});

var MusicUpload = multer({ storage: MusicStorage }).single("music"); 


module.exports = router => {

    router.get('/', (req, res) => res.end('Team Echo flashmob party node server.'));

    router.post('/Test',(req,res)=>{
        const pid=req.body.pid;
        music.test(pid)
            .then(result => {
                res.status(result.status).json( result.message )
            })
            .catch(err => res.status(err.status).json({ message: err.message }));
    });

    router.post('/authenticate', (req, res) => {
        const email = req.body.email;
        const password = req.body.pass;
        if (!email || !password) {
            res.status(200).json({ message: 'Invalid Request !' });
        } else {
            login.loginUser(email, password)
            .then(result => {
                const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
                res.status(200).json({ message: result.message, token: token });
            })
            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });

    router.post('/users', (req, res) => {
        upload(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong!"+err.message);
            }
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const age = req.body.age;
            const city = req.body.city;
            const i=req.files;
            var filename="";
             console.log(i);
            if(i.length!=0){
                filename=i[0].filename;
            }

            if (!name || !email || !password || !age || !city || !name.trim() || !email.trim() || !password.trim() || !age.trim()|| !city.trim()) {
                console.log(req.body);
                res.status(400).json({message: 'Invalid Request !'});

            } else {
                register.registerUser(name, email, password, age, city,filename)

                    .then(result => {
                        res.setHeader('Location', '/users/'+email);
                        res.status(result.status).json({ message: result.message })
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
        });
    });

    router.post('/updateuser', (req, res) => {
        upload(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong!"+err.message);
            }
            const name = req.body.name;
            const email = req.body.email;
            const age = req.body.age;
            const city = req.body.city;
            if (!name || !email ||  !age || !city || !name.trim() || !email.trim() || !age.trim()|| !city.trim()) {
                res.status(200).json({message: 'Invalid Request !'});
            }
            if(req.files.length==1){
                const i=req.files;
                profile.userupdate(email,name,city,age,i[0].filename)
                    .then(result => {
                        res.status(result.status).json({ message: result.message })
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
            else{
                profile.userupdate(email,name,city,age,"")
                    .then(result => {
                        res.status(result.status).json({ message: result.message })
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
        });
    });

    router.get('/users/:id', (req,res) => {
        const id =req.params.id;
        profile.getProfile(req.params.id)

                .then(result => res.json(result))

                .catch(err => res.status(err.status).json({ message: err.message }));
        });

    router.put('/users/:id', (req,res) => {

        if (checkToken(req)) {

            const oldPassword = req.body.password;
            const newPassword = req.body.newPassword;

            if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

                res.status(400).json({ message: 'Invalid Request !' });

            } else {

                password.changePassword(req.params.id, oldPassword, newPassword)

                .then(result => res.status(result.status).json({ message: result.message }))

                .catch(err => res.status(err.status).json({ message: err.message }));

            }
        } else {

            res.status(401).json({ message: 'Invalid Token !' });
        }
    });

    router.post('/users/:id/password', (req,res) => {

        const email = req.params.id;
        const token = req.body.token;
        const newPassword = req.body.password;

        if (!token || !newPassword || !token.trim() || !newPassword.trim()) {
            password.resetPasswordInit(email)
            .then(result => res.status(result.status).json({ message: result.message }))

            .catch(err => res.status(err.status).json({ message: err.message }));

        } else {
            password.resetPasswordFinish(email, token, newPassword)
            .then(result => res.status(result.status).json({ message: result.message }))

            .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });

    //Party Create
    router.post('/party',(req,res)=>{
        const cname  = req.body.cname;
        const email = req.body.email;
        const pname = req.body.pname;
        const ptime = req.body.ptime;
        const pdate = req.body.pdate;
        const location = req.body.location;
        const flag = req.body.flag;
        const pepole = req.body.pepole;
        const leti=req.body.let;
        const lang=req.body.lang;
        const city=req.body.city;
        const uid=req.body.uid;
        if (!email || !pname || !ptime || !pdate || !location || !flag || !pepole || !leti || !city || !uid) {
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            party.party(cname,email, pname, ptime, pdate, location, flag, pepole,leti,lang,city,uid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.get('/party',(req,res)=>{
        party.getparty()
            .then(result => {
                res.status(result.status).json(result.message)
            })
            .catch(err => res.status(err.status).json({message: err.message}));
    });

    router.post('/getPartydate',(req,res)=>{
        const date=req.body.date;
        if (!date) {
             res.status(400).json({ message: 'Invalid Request !' });
        }else 
        {
            party.getallpartydate(date)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/searchparty',(req,res)=>{
        const city=req.body.city;
        const date=req.body.date;
        if (!city || !date) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.searchparty(city,date)
                .then(result => {
                    res.status(result.status).json(result.message);
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/joinParty',(req,res)=>{
        const pid=req.body.pid;
        const uid=req.body.uid;
        if (!pid || !uid) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.requestParty(pid,uid)
                .then(result => {
                    res.status(result.status).json({message:result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/listPartyUser',(req,res)=>{
        const uid=req.body.uid;
        if (!uid) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.userByPartyList(uid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/partyUserAttend',(req,res)=>{
        const pid=req.body.pid;
        if (!pid) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.partyUserAttend(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/partyUserList',(req,res)=>{
        const pid=req.body.pid;
        if (!pid) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.partyUserList(pid)
                .then(result => {
                    res.status(result.status).json( result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/userStepCount',(req,res)=>{
        const pid=req.body.pid;
        if (!pid) {
             res.status(400).json({ message: 'Invalid Request !' });
        } else {
            stepcount.stepcountparty(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });


    router.post('/getProfile',(req,res)=>{
        const sid = req.body.sid;
        const rid = req.body.rid;
        if (!sid || !rid) {
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            freq.getProfile(sid,rid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/accounts',(req,res)=>{
        const search = req.body.search;
        if (!search) {
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
         register.getAllAcount(search)
             .then(result => {
                 res.status(result.status).json(result.message)
             })
             .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/sendRequest',(req,res)=>{
        const sid = req.body.sid;
        const rid = req.body.rid;
        if (!sid || !rid) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            freq.sendRequest(sid,rid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/acceptRequest',(req,res)=>{
        const sid = req.body.sid;
        const rid = req.body.rid;
        const status=req.body.status;
        if (!sid || !rid || !status) {

            res.status(400).json({ message: 'Invalid Request !' });

        }  else {
            freq.responseRequest(sid,rid,status)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/friendlist',(req,res)=>{
        const ouid = req.body.ouid;

        if (!ouid) {

            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            freq.FriendList(ouid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/getChat',(req,res)=>{
        const pid = req.body.pid;

        if (!pid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            chat.getChat(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/friendrequest',(req,res)=>{
        const ouid = req.body.ouid;
        if (!ouid) {
            res.status(400).json({ message: 'Invalid Request !' });

        } else {
            freq.FriendReqList(ouid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    //party Image Upload
    router.post('/partyImageUpload', (req, res) => {
        upload(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong!"+err.message);
            }
            const name = req.body.name;
            const caption = req.body.caption;
            const pid = req.body.pid;
            const i=req.files;

            if (!name || !pid ) {
                res.status(400).json({message: 'Invalid Request !'});
            }else {
                pimg.uploadPartyImage(pid, i[0].filename, name,caption)
                        .then(result => {
                        res.status(result.status).json({ message: result.message })
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
        });
    });

    router.post('/getImage',(req,res)=>{
        const pid = req.body.pid;

        if (!pid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            pimg.getImage(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    //Party Music
    router.post('/partyMusicUpload', (req, res) => {
        MusicUpload(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong!"+err.message);
            }
            const name = req.body.name;
            const uid  = req.body.uid;
            const pid  = req.body.pid;
            const i=req.file;

            if (!name || !pid ) {
                res.status(400).json({message: 'Invalid Request !'});
            }else {
                music.uploadPartyMusic(pid, i.filename, name,uid)
                        .then(result => {
                        res.status(result.status).json({ message: result.message })
                    })
                    .catch(err => res.status(err.status).json({ message: err.message }));
            }
        });
    });

    router.post('/getMusic',(req,res)=>{
        const pid = req.body.pid;
        if (!pid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            music.getMusic(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/getMusicById',(req,res)=>{
        const pid = req.body.pid;
        const uid = req.body.uid;
        if (!pid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            music.getMusicById(pid,uid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    //Like Dislike Send
    router.post('/sendLikeDislike',(req,res)=>{
        const pid  = req.body.pid;
        const uid  = req.body.uid;
        const mid  = req.body.mid;
        const like = req.body.like;

        if (!pid || !uid || !mid || !like) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            musiclike.sendlike(pid,uid,mid,like)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/checkLike',(req,res)=>{
        const pid  = req.body.pid;
        const uid  = req.body.uid;
        const mid  = req.body.mid;

        if (!pid || !uid || !mid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            musiclike.checkLike(pid,uid,mid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/countLike',(req,res)=>{
        const pid  = req.body.pid;
        const mid  = req.body.mid;

        if (!pid || !mid ) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            musiclike.countLike(pid,mid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/removemusic',(req,res)=>{
        const mid  = req.body.mid;

        if (!mid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            music.removeMusic(mid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

     router.post('/removeParticipate',(req,res)=>{
        const pid  = req.body.pid;
        const uid  = req.body.uid;
        if (!pid || !uid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.removeUserParty(pid,uid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/getuserparty',(req,res)=>{
        const uid  = req.body.uid;
        if (!uid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.getuserparty(uid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/closeparty',(req,res)=>{
        const pid  = req.body.pid;
        if (!pid) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            party.closeparty(pid)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/imageComment',(req,res)=>{
        const img_id=req.body.img_id
        const comment  = req.body.comment;
        const user  = req.body.user;
        if (!img_id || !comment || !user ) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
             pimg.imageComment(img_id,comment,user)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.post('/getImageComment',(req,res)=>{
        const img_id  = req.body.img_id;
        if (!img_id) {
            res.status(400).json({ message: 'Invalid Request !' });
        } else {
            pimg.imageCommentGet(img_id)
                .then(result => {
                    res.status(result.status).json(result.message)
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    function checkToken(req) {
        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);
                return decoded.message === req.params.id;

            } catch(err) {
                return false;
            }

        } else {
            return false;
        }
    }
}