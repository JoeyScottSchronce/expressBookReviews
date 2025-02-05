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
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN = req.params.isbn;
  if (books[ISBN]) {
    return res.status(200).send(books[ISBN])
  } else {
    return res.status(404).send("book not found.")
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;

  if (author) {
    let filtered = [];
    for (key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            filtered.push(books[key]);
        }
    } res.status(200).send(filtered);
  } else {
    res.status(404).send("Author not found!");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;

    if (title) {
      let filtered = [];
      for (key in books) {
          if (books[key].title.toLowerCase() === title.toLowerCase()) {
              filtered.push(books[key]);
          }
      } res.status(200).send(filtered);
    } else {
      res.status(404).send("Title not found!");
    }
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
