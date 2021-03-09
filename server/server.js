/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db.js");
const { hash, compare } = require("./utils/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

//middleware

app.use(
    cookieSession({
        secret: `I am hAngry`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.urlencoded({ extended: false }));

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

//routes

app.get("/welcome", (req, res) => {
    // is going to run if the user puts /welcome in the url bar
    if (req.session.userId) {
        console.log("userID is", req.session.userId);
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
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        const { first, last, email, password } = req.body;
        hash(password)
            .then((password_hash) => {
                db.addUser(first, last, email, password_hash)
                    .then(({ rows }) => {
                        console.log("rows", rows);
                        req.session.userId = rows[0].id;
                        res.json({ data: rows[0], success: true });
                    })
                    .catch((error) => {
                        console.log("Error:", error);
                        res.json({ success: false, error: true });
                    });
            })
            .catch((error) => {
                console.log("Error with password_hash:", error);
            });
    } else {
        res.json({ success: false, error: true });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    // console.log("email & password:");
    if (email == "" || password == "") {
        return res.json({
            success: false,
            error: true,
        });
    }

    db.getUser(email)
        .then(({ rows }) => {
            const password_hash = rows[0].password_hash;
            const id = rows[0].id;
            return compare(password, password_hash).then((match) => {
                console.log("match:", match);
                if (match) {
                    req.session.userId = id;
                    res.json({ success: true, error: false });
                } else {
                    res.json({ success: false, error: true });
                }
            });
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.json({ success: false, error: true });
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
