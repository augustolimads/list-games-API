const express = require("express")
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Fake database listing games
 */
const DB = {
    games: [
        {
            id: 23,
            title: "Call of Duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 23,
            title: "Sea of Thieves",
            year: 2019,
            price: 60
        },
        {
            id: 23,
            title: "Minecraft",
            year: 2019,
            price: 60
        }
    ]
}

app.get("/", (req, res) => {
    res.statusCode = 200;
    res.json(DB.games)
})

const port = 8080;
app.listen(port, () => {
    console.log(`Running API at port: http://localhost:${port}`)
})