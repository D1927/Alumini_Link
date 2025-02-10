const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.listen(port , () => {
    console.log("Server is Running !")
})

var questions = [];

app.get('/' , (req , res) => {
    res.send("Hey its Root Directory !");
})

app.get('/question' , (req ,res) => {
    res.json(questions);
})

app.post('/question' , (req , res) => {
    const {student , question} = req.body;
   
    if (!student || !question)
    {
        res.status(400);
        return res.json({error : "Valid Name and Question are Required !"})
    }

    const newQuestion = {
        id : questions.length + 1 , 
        student ,
        question
    };

    questions.push(newQuestion);
    res.status(201).json({ message: "Question posted successfully!", newQuestion });
})

app.patch('/question/:id', (req, res) => {
    const { id } = req.params;
    const { alumni, answer } = req.body;

    if (!alumni || !answer) {
        return res.status(400).json({ error: "Valid Alumni name and Answer are required!" });
    }

    const question = questions.find(q => q.id == id);

    if (!question) {
        return res.status(404).json({ error: "Question not found!" });
    }

    if (!question.answers) {
        question.answers = [];
    }

    question.answers.push({ alumni, answer });

    res.json({ message: "Answer added successfully!", question });
});

app.get('/question/:id', (req, res) => {
    const { id } = req.params;
    const question = questions.find(q => q.id == id);

    if (!question) {
        return res.status(404).json({ error: "Question not found!" });
    }

    res.json(question);
});

