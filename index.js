const express = require("express");
const cors = require("cors");


require("./db/config");
const User = require('./db/User');
const Student = require('./db/Student');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", verifyToken,async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send("Something went wrong")
        }
        resp.send({ result, auth: token })
    })
})




app.post("/login",async (req, resp) => {



    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send("Something went wrong")
                }
                resp.send({ user, auth: token })
            })
        } else {
            resp.send({ result: "No User found" })
        }
    } else {
        resp.send({ result: "No User found" })
    }
});

app.post("/add-student",async (req, resp) => {
    let student = new Student(req.body);
    let result = await student.save();
    resp.send(result);

});
// })
app.get("/students",async (req, resp) => {
    const students = await Student.find();
    if (students.length > 0) {
        resp.send(students)
    } else {
        resp.send({ result: "No Student found" })
    }
});
app.delete("/student/:id", async (req, resp) => {
    let result = await Student.deleteOne({ _id: req.params.id });
    resp.send(result)
}),
    app.get("/student/:id", async (req, resp) => {
        let result = await findOne({ _id: req.params.id })
        if (result) {
            resp.send(result)
        } else {
            resp.send({ "result": "No Record Found." })
        }
    })
app.put("/student/:id",async (req, resp) => {
    let result = await Student.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});
// app.put("/student/:id", verifyToken,async (req, resp) => {
//     let result = await Student.updateOne(
//         { _id: req.params.id },
//         { $set: req.body }
//     )
//     resp.send(result)
// });

app.get("/search/:key", async (req, resp) => {
    let result = await Student.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    resp.send(result);
});
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Please provide valid token" })
            } else {
                next();
            }
        })
    } else {
        resp.status(403).send({ result: "Please add token with header" })
    }

}

app.listen(3000);