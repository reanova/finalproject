/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db.js");
const { hash, compare } = require("./utils/bc.js");
const cookieSession = require("cookie-session");

//middleware
app.use(express.json());

app.use(compression());

app.use(express.urlencoded({ extended: false }));
app.use(
    cookieSession({
        secret: `I am hAngry`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/welcome", (req, res) => {
    // is going to run if the user puts /welcome in the url bar
    if (req.session.userId) {
        // if the user is logged in, they are NOT allowed to see the welcome page
        // so we redirect them away from /welcome and towards /, a page they're allowed to see
        res.redirect("/");
    } else {
        // send back HTML, which will then trigger start.js to render Welcome in DOM
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/register", (req, res) => {
    // console.log("req.body", req.body);
    const { first, last, email, password } = req.body;
    hash(password)
        .then((password_hash) => {
            db.addUser(first, last, email, password_hash)
                .then(({ rows }) => {
                    console.log("rows", rows);
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error:", err);
                    if (err.message.includes("violates check constraint")) {
                        err.message =
                            "No can do. Please fill in all the input fields";
                    } else {
                        err.message = "That email already exists";
                    }
                    res.json(err.message);
                });
        })
        .catch((error) => {
            console.log("Error with password_hash:", error);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
