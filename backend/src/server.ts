import express from 'express'

const app = express()

app.use(express.json())

app.listen(3001, () => {
  console.log('Server started')
})

const movies = [
    {
        id: '1',
        title: 'Batman',
        description: 'Good movie about rich strong guy by DC'
    },
    {
        id: '2',
        title: 'Spider-Man',
        description: 'Good superheroic movie by Marvel'
    }
]

app.get('/movies', (req, res) => {
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(movie => movie.id === req.params.id)

    if(!movie){
        return res.status(404).json({
            message: 'Фильм не найден'
        })
    }

    res.json(movie)
})

app.post('/movies', (req, res) => {
    const newMovie = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
    const index = movies.findIndex(
        movie => movie.id === req.params.id
    )

    if(index === -1){
        return res.status(404).json({
            message: 'Фильм не найден'
        })
    }

    movies.splice(index, 1)

    res.status(200).json({
        message: 'Удалено'
    })
})

