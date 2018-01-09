# Adding sqlite3

* `npm install sqlite3`
* Add your Pirates DB to the project!
* update the suffix to be `*.sqlite`
* Let's connect.

```js
const express = require("express");
const sqlite = require("sqlite3").verbose();

//Connect to your DB
const db = new sqlite.Database("./deadSeas.sqlite", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("........Connected to The DeadSea, arrrrrrgh.");
});
```
