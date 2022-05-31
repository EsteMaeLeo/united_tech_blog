const path = require("path");

const express = require("express");
const routes = require("./controllers");
// import sequelize connection
const sequelize = require("./config/connection");

const session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const exphbs = require("express-handlebars");
const hbs = exphbs.create({});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// session cookies
const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

// sync sequelize models to the database, then turn on the server
// { force: true } for new changes
sequelize.sync({ force: false }).then(
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  })
);

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}!`);
// });
