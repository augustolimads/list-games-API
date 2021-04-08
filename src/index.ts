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
            id: 1,
            title: "Call of Duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 2,
            title: "Sea of Thieves",
            year: 2019,
            price: 60
        },
        {
            id: 3,
            title: "Minecraft",
            year: 2019,
            price: 60
        }
    ]
}

app.get("/games", (req, res) => {
    res.statusCode = 200;
    res.json(DB.games)
})

app.get("/games/:id", (req, res) => {
    let {id} = req.params

    if(isNaN(id)){
        res.statusCode = 400
        res.json({message: "This is not a number"})
    }

    let game = DB.games.find(game => game.id === Number(id))
    if(game) {
        res.statusCode = 200
        res.json({game})
    } else {
        res.statusCode = 404
        res.json({message: "not found this id"})
    }
    
})

app.post("/games", (req, res) => {
    const {title, price, year } = req.body

    if(!title || !price || !year){
        res.statusCode = 400
        res.json({message: "missing some field"})
    }

    const idList = DB.games.map(game => game.id)
    const maxId = Math.max(...idList)

    DB.games.push({
        id: maxId + 1,
        title,
        price,
        year
    })

    res.statusCode = 200
    res.json({message: "new game added!", games: DB.games})
})

app.delete("/games/:id", (req, res) => {
    const {id} = req.params 

    if(isNaN(id)){
        res.statusCode = 400
        res.json({message: "This is not a number"})
    }
    
    const indexOfId = DB.games.findIndex(game => game.id === Number(id))
    if(indexOfId || indexOfId === 0) {
        DB.games.splice(indexOfId, 1)
        res.json({message: "game removed!", games: DB.games})
    } else {
        res.statusCode = 404        
        res.json({message: `This id = ${id} is not found`})
    }
})

app.put("/games/:id", (req, res) => {
    const {id} = req.params 
    const {title, price, year } = req.body

    if(!title || !price || !year){
        res.statusCode = 400
        res.json({message: "missing some field"})
    }

    if(isNaN(id)){
        res.statusCode = 400
        res.json({message: "This is not a number"})
    }

    const indexOfId = DB.games.findIndex(game => game.id === Number(id))
    if(indexOfId || indexOfId === 0) {
        DB.games[indexOfId] = { id, title, price, year }
        res.json({message: "game updated!", games: DB.games})
    } else {
        res.statusCode = 404        
        res.json({message: `This id = ${id} is not found`})
    }
})

const port = 8080;
app.listen(port, () => {
    console.log(`Running API at port: http://localhost:${port}`)
})