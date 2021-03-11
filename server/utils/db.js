const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/fennelsocialnetwork`
);

module.exports.addUser = (first, last, email, password_hash) => {
    const q = `
        INSERT INTO users (first, last, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first, last, email, password_hash];
    return db.query(q, params);
};

module.exports.getUser = (email) => {
    const q = `
    SELECT * FROM users
    WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserById = (id) => {
    const q = `
        SELECT * FROM users
        WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addCode = (email, code) => {
    const q = `
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getCode = (email) => {
    const q = `
        SELECT * FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePassword = (email, new_password_hash) => {
    const q = `
        UPDATE users
        SET password_hash = $2
        WHERE email = $1
    `;
    const params = [email, new_password_hash];
    return db.query(q, params);
};
