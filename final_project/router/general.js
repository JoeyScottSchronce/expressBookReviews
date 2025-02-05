const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 2000); //setTimeout waits 2 seconds before resolving the request
    })
    .then((books) => {
        res.status(200).send(JSON.stringify(books, null, 4));
    });
});
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let ISBN = req.params.isbn;

    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[ISBN]) {
                resolve(books[ISBN]);
            } else {
                reject("book not found.");
            }
        }, 2000);
    })
    .then((details) => {
        res.status(200).send(details);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
});

// Get book details based on author with a delay of two seconds
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered = Object.values(books).filter(book => book.author.toLowerCase() === author);
            filtered.length ? resolve(filtered) : reject("Author not found!");
        }, 2000);
    })
    .then(filtered => res.status(200).send(filtered))
    .catch(error => res.status(404).send(error));
});

// Get book details based on title with a delay of two seconds
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered = Object.values(books).filter(book => book.title.toLowerCase() === title);
            filtered.length ? resolve(filtered) : reject("title not found!");
        }, 2000);
    })
    .then(filtered => res.status(200).send(filtered))
    .catch(error => res.status(404).send(error));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN = req.params.isbn;
    if (books[ISBN]) {
        return res.status(200).send(books[ISBN]["reviews"])
    } else {
        return res.status(404).send("no reviews found.")
    }
});

module.exports.general = public_users;
