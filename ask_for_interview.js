const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.listen(port , () => {
    console.log("Server is Running !");
})

var available_slots = [];
var interested_students = [];

app.post('/alumini/slots' , (req , res) => {
    const {alumini , date , time} = req.body ;

    if (!alumini || !date || !time)
    {
        res.status(400);
        return res.json({error : "Valid Alumini Name and date and time are Required !"})
    }

    const slot = {
        id : available_slots.length + 1 , 
        alumini , 
        date , 
        time ,
        booked : false , 
        student : null
    };

    available_slots.push(slot);
    res.status(201);
    res.json({message : "Slot Confirmed !" , slot});

})

app.get('/alumini/slots' , (req , res) => {
    res.json(available_slots.filter(slot => !slot.booked));
})

app.post('/student/slot' , (req , res) => {
    const {student} = req.body;

    if (!student)
    {
        res.status(400);
        return res.json({error : "Student not Found !"})
    }

    const stud = {
        id : interested_students.length + 1 ,
        student
    }

    interested_students.push(stud);
    res.status(201);
    res.json({message : "Your Slot Requested !"})
})

app.get('/student/slot' , (req , res) => {
    res.json(interested_students);
})

app.post("/students/book-slot/:slotId", (req, res) => {
    const { slotId } = req.params;
    const { student } = req.body;
    
    const slotIndex = available_slots.findIndex(slot => slot.id == slotId && !slot.booked);
    if (slotIndex === -1) {
        return res.status(400).json({ message: "Slot not available!" });
    }
    
    available_slots[slotIndex].booked = true;
    available_slots[slotIndex].student = student;

    interested_students = interested_students.filter(stud => stud.student !== student);

    res.json({ message: "Slot booked successfully!", slot: available_slots[slotIndex] });
});

app.get("/students/notifications", (req, res) => {
    res.json(available_slots.filter(slot => !slot.booked));
});
