/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db.js");
const { hash, compare } = require("./utils/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("../ses");
const s3 = require("../s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { s3Url } = require("../config.json");
const cryptoRandomString = require("crypto-random-string");

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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    db.getUser(email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                const code = cryptoRandomString({
                    length: 6,
                });
                return db.addCode(email, code);
            } else {
                res.json({
                    success: false,
                    error: true,
                });
            }
        })
        .then(({ rows }) => {
            console.log("Code added to table", rows[0]);
            return ses.sendEmail(
                rows[0].email,
                `You recently requested a password reset. Please enter the following code to reset your password before it expires: ${rows[0].code}`,
                "Pithagora - Reset your password"
            );
        })
        .then(() => {
            res.json({
                success: true,
                error: false,
            });
        })
        .catch((error) => {
            console.log("Error in password reset: ", error);
            res.json({
                success: false,
                error: true,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, code, newPassword } = req.body;
    db.getCode(email)
        .then(({ rows }) => {
            if (rows[rows.length - 1].code == code) {
                hash(newPassword)
                    .then((new_password_hash) => {
                        db.updatePassword(email, new_password_hash)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((error) => {
                                console.log("Error", error);
                            });
                    })
                    .catch((error) => {
                        console.log("Error", error);
                    });
            } else {
                console.log("No match!");
                res.json({ success: false });
            }
        })
        .catch((error) => {
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)
        .then(({ rows }) => {
            console.log("user data: ", rows[0]);
            console.log("image url: ", rows[0].image_url);
            res.json({ rows });
        })
        .catch(() => {
            console.log("error in getUserById");
        });
});

//workflow like imageboard (same bucket because lazy)

app.post(
    "/user/uploadimage",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("post working");
        if (req.file) {
            const { filename } = req.file;
            db.addImage(s3Url + filename, req.session.userId)
                .then(({ rows }) => {
                    console.log(
                        "Successfully added image to db: ",
                        s3Url + filename
                    );
                    res.json({
                        success: true,
                        imageUrl: s3Url + filename,
                    });
                })
                .catch((error) => {
                    console.log("Error adding image to db ", error);
                    res.json({
                        success: false,
                    });
                });
        } else {
            res.json({
                success: false,
            });
        }
    }
);

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
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
