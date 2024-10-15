const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CredentialModel = require('./model/Credentials.js');
const QuizModel = require('./model/Quizqns.js');
const MarkModel=require("./model/Marks.js");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/quiziz");

app.post('/register', (req, res) => {
    CredentialModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: err.message }));
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    CredentialModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({
                        message: "Success",
                        name: user.name,
                        email: user.email,
                        password:user.password
                    });
                } else {
                    res.json({
                        message: "The password is incorrect"
                    });
                }
            } else {
                res.json({
                    message: "No record exists"
                });
            }
        });
});
app.post("/addmark",(req,res)=>{
    console.log(req.body)
    MarkModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
}
);
app.post('/check-quiz-attempt', (req, res) => {
    const { email, topic } = req.body;
    console.log("ET",email,topic)
    // Query the database to check if the user has already attempted the quiz
    MarkModel.findOne({ email, topic })
        .then(attempt => {
            if (attempt) {
                // User has already attempted the quiz
                res.status(200).json({ attempted: true });
            } else {
                // User has not attempted the quiz yet
                res.status(200).json({ attempted: false });
            }
        })
        .catch(error => {
            console.error('Error checking quiz attempt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
app.post('/get-marks-user',(req,res)=>{
    const { email } = req.body;
    MarkModel.find({email})
    .then(user=>{
        console.log("GETMARKS",user)
        res.json(user)
    })
    .catch(error => {
        res.status(500).json({ error: 'Internal Server Error' });
    });

})
app.post('/get-marks-admin',(req,res)=>{
    const { topic } = req.body;
    MarkModel.find({ topic:topic })
    .then(user=>{
        console.log("GETMARKS",user)
        res.json(user)
    })
    .catch(error => {
        res.status(500).json({ error: 'Internal Server Error' });
    });

})
app.get('/quizes', (req, res) => {
    QuizModel.find({})
        .then(quizes => {
            console.log("Quizes fetched:", quizes);
            res.json(quizes);
        })
        .catch(err => {
            console.error("Error fetching quizes:", err);
            res.status(500).json({ error: err.message });
        });
});

app.listen(3001,()=>{console.log("Server is listening to port 3001")});