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

* Double check the query!!!

```js
//Let's run a query to confirm
const query = `SELECT * from Pirates`;
db.each(query, (err, row) => {
  if (err) throw err;
  console.log(row);
});
```

# Add Sequilize

[Example Link](https://github.com/sequelize/express-example)
[Working Example](https://github.com/jtomchak/api-pirates/blob/sequilize/index.js)

```sh
node_modules/.bin/sequelize init
```

```sh
node_modules/.bin/sequelize init

node_modules/.bin/sequelize model:create --name Pirate --attributes family_name:String
```

## Your Pirates model should be something like....

```js
module.exports = (sequelize, DataTypes) => {
  var Pirates = sequelize.define(
    "Pirates",
    {
      pirate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      family_name: DataTypes.STRING,
      rank: DataTypes.INTEGER,
      beard: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      birth_country: DataTypes.STRING,
      worth: DataTypes.INTEGER,
      date_of_death: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return Pirates;
};
```

## Don't forget to update your config.js file!!!!

```js
// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("config", "config.js")
};
```
