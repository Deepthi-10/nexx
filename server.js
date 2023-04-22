var express = require('express');
var cors = require('cors');
const fetch = (...args) => 
    import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

// Client ID and Client Secret of the registered app in the github
//const CLIENT_ID = "c2c0fefcb0940e6b1ed7";
//const CLIENT_SECRET = "e02a73e16e8e03bbc55839ccdec30f5c60883867";
const CLIENT_ID = "a8f53c84a79e8f97b9d4";
const CLIENT_SECRET = "4e9a560f5032815695a8583c6ce57e826fb7141a";

var app = express();

app.use(cors());
app.use(bodyParser.json());

// getAccessToken Route will provide the accesstoken using client ID , client secret, code 
app.get('/getAccessToken', async function (req, res){
    try{
    const params = "?client_id=" + CLIENT_ID + "&client_secret="+ CLIENT_SECRET+ "&code=" + req.query.code;
    await fetch("https://github.hpe.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    }).then((response) => {
        return response.json()
    }).then((data)=> {
        console.log(data);
        res.json(data);
    }).catch((error) =>{
        console.log(error)
    });
} catch(error){
    console.log("error in fetching the access token", error);
}
});

// getUserDate Route will provide User details who have logged in using the accessToken
app.get('/getUserData', async function (req, res){
    try{
    req.get("Authorization");
    await fetch("https://github.hpe.com/api/v3/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    }).catch((error) =>{
        console.log(error)
    })
}catch(error){
    console.log("error in fetching the userData", error);
}
})

// The server is running in the port 8773
app.listen(8773,function (){
    console.log("CORS server running on port 8773");
});