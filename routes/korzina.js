const express = require('express')
const router = express.Router()
const { Korzina, Books } = require('../model/Books')

// GET method // Read
router.get('/', async (req, res, next) => {
    const totalPrice = await Korzina.getTotalPrice();
    const books = await Korzina.getAllBooks();

    res.render('korzina',
        {
            title: 'Korzina',
            isAbout: true,
            books,
            totalPrice
        })
})

// Add or Remove book from korzina 
router.get('/book/:id/:mode', async (req, res) => {
    const id = req.params.id;
    const mode = JSON.parse(req.params.mode);

    try {
        await Korzina.toKorzinaById(id, mode);

        res.redirect('/korzina')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
