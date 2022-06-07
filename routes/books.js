const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const { Books, Korzina } = require('../model/Books')

// View all books
router.get('/', async (req, res) => {
    const books = await Books.getAll()
    res.render('books', {
        title: 'All books',
        books,
        isBooks: true
    })
})

router.get('/add', (req, res) => {
    res.render('formBooks', {
        title: 'Add new book',
        isBooks: true
    })
})

// Get book by id
router.get('/:id', async (req, res) => {
    Books.findById(req.params.id)
        .then(book => {
            res.render('book', {
                book,
                title: book.name
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).redirect('/404')
        })
})

// Get request with query
router.get('/sort', (req, res) => {
    const book = books.find((book) => req.query.name === book.name)
    // const book = books.find((book) => +req.query.id === book.id)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu ismli kitob mavjud emas...')
    }
})

// Get request with params
// router.get('/:id/:polka', (req, res) => {
//     // console.log(req.params.id);
//     // console.log(req.params.polka);
//     // Parametr aniqlanadi
//     const id = +req.params.id
//     // Parametrni tekshirish kerak
//     // Bazadan qidiriladi parametr bo'yicha
//     const book = books.find((book) => book.id === id)
//     if (book) {
//         // Clientga chiqariladi
//         res.status(200).send(book)
//     } else {
//         res.status(400).send('Bu parametrli kitob mavjud emas...')
//     }

// })

// POST request
router.post('/add', authMiddleware, async (req, res) => {
    // Baza chaqiramiz
    // let allBooks = books  // []

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
        img: Joi.string()
    })

    const result = bookSchema.validate(req.body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }

    const book = new Books(
        req.body.name,
        req.body.year,
        req.body.img
    )

    await book.save()
    res.status(201).redirect('/api/books')
})

// PUT request
router.put('/update/:id', authMiddleware, (req, res) => {
    let allBooks = books
    // id orqali yangilanmoqchi bo'lgan obj ni index kalitini topamiz
    const idx = allBooks.findIndex(book => book.id === +req.params.id)
    // yangi obj ni idx joylaymiz // [idx] = {newObj}

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
    })

    validateBody(req.body, bookSchema, res)

    let updatedBook = {
        name: req.body.name,
        year: req.body.year,
        id: +req.params.id,
    }

    allBooks[idx] = updatedBook

    res.status(200).send(updatedBook)
})

// Remove book
router.get('/remove/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    Books.removeById(id).then(() => {
        res.redirect('/api/books')
    }).catch(err => {
        console.log(err)
        res.redirect('/404')
    })
})

function validateBody(body, bookSchema, res) {
    const result = bookSchema.validate(body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
}

module.exports = router