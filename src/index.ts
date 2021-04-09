const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const authMiddleware = require("./middlewares/auth");

dotenv.config();

const JWTSecret = process.env.JWTSECRET;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Fake database listing games
 */
const DB = {
  games: [
    {
      id: 1,
      title: "Call of Duty MW",
      year: 2019,
      price: 60,
    },
    {
      id: 2,
      title: "Sea of Thieves",
      year: 2019,
      price: 60,
    },
    {
      id: 3,
      title: "Minecraft",
      year: 2019,
      price: 60,
    },
  ],
  users: [
    {
      id: 1,
      name: "Augusto Lima",
      email: "augusto@email.com",
      password: "123456",
    },
    {
      id: 2,
      name: "Falkor Merak",
      email: "falkor@email.com",
      password: "123456",
    },
  ],
};

/**
 * Middleware for check token authorization
 */
 function auth(req, res, next) {
  const authToken = req.headers.authorization

  console.log(authToken)

  if(!authToken){
      res.status(401)
      res.json({err: "Token not found"})
  }

  const tokenInArray = authToken.split(" ")
  const token = tokenInArray[1]

  jwt.verify(token, process.env.JWTSECRET, (err, data) => {
      if(err) {
          res.status(401)
          res.json({err: "invalid token"})
      }

      req.token = token;
      req.loggedUser = {id: data.id, email: data.email};
      next()
  })

}

app.get("/games", auth, (req, res) => {
  res.status(200);
  res.json(DB.games);
});

app.get("/games/:id", auth, (req, res) => {
  let id = Number(req.params.id);


  if (isNaN(id)) {
    res.status(400);
    res.json({ message: "This is not a number" });
  }

  let game = DB.games.find((game) => game.id === id);
  if (game) {
    res.status(200);
    res.json({ game });
  } else {
    res.status(404);
    res.json({ message: "not found this id" });
  }
});

app.post("/games",auth, (req, res) => {
  const { title, price, year } = req.body;

  if (!title || !price || !year) {
    res.status(400);
    res.json({ message: "missing some field" });
  }

  const idList = DB.games.map((game) => game.id);
  const maxId = Math.max(...idList);

  DB.games.push({
    id: maxId + 1,
    title,
    price,
    year,
  });

  res.status(200);
  res.json({ message: "new game added!", games: DB.games });
});

app.delete("/games/:id",auth, (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400);
    res.json({ message: "This is not a number" });
  }

  const indexOfId = DB.games.findIndex((game) => game.id === id);
  if (indexOfId || indexOfId === 0) {
    DB.games.splice(indexOfId, 1);
    res.json({ message: "game removed!", games: DB.games });
  } else {
    res.status(404);
    res.json({ message: `This id = ${id} is not found` });
  }
});

app.put("/games/:id",auth, (req, res) => {
  const id = Number(req.params.id);
  const { title, price, year } = req.body;

  if (!title || !price || !year) {
    res.status(400);
    res.json({ message: "missing some field" });
  }

  if (isNaN(id)) {
    res.status(400);
    res.json({ message: "This is not a number" });
  }

  const indexOfId = DB.games.findIndex((game) => game.id === id);
  if (indexOfId || indexOfId === 0) {
    DB.games[indexOfId] = { id, title, price, year };
    res.json({ message: "game updated!", games: DB.games });
  } else {
    res.status(404);
    res.json({ message: `This id = ${id} is not found` });
  }
});

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    res.json({ err: "Email or password invalid" });
  }

  const user = DB.users.find((user) => user.email === email);

  if (!user) {
    res.status(404);
    res.json({ err: "Email sended not found" });
  }

  if (user.password !== password) {
    res.status(401);
    res.json({ err: "Password invalid" });
  }

  jwt.sign({ id: "user.id", email: "user.email" },JWTSecret,{ expiresIn: "48h" },
    (err, token) => {
        if(err){
            res.status(400)
            res.json({err:"internal error", id: user.id, email: user.email})
            return
        }

        res.json({token: token, id: user.id, email: user.email, JWTSecret})
        // res.json({ token: "fake_token_123" });
    }
  );
});

const port = 8080;
app.listen(port, () => {
  console.log(`Running API at port: http://localhost:${port}`);
});
