const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')

class Books {
    constructor(name, year, img) {
        this.name = name
        this.year = year
        this.img = img
    }

    toObj() {
        return {
            name: this.name,
            year: +this.year,
            img: this.img,
            id: uuid()
        }
    }

    async save() {
        const books = await Books.getAll() // []
        const book = this.toObj()

        books.push(book)
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'books.json'),
                JSON.stringify({ books }),
                (err) => {
                    if (err) reject(err)
                    else resolve()
                })
        })
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            // console.log(this.toObj());
            // resolve(this.toObj())

            fs.readFile(path.join(__dirname, '..', 'data', 'books.json'), 'utf-8', (err, content) => {
                if (err) reject(err)
                else resolve(JSON.parse(content).books)
            })
        })
    }

    static async findById(id) {
        const books = await Books.getAll()

        return new Promise((resolve, reject) => {
            const book = books.find(book => book.id === id)
            if (!book) {
                return reject('Book not found')
            }
            resolve(book)
        })
    }

    static async removeById(id) {
        let books = await Books.getAll()
        return new Promise((resolve, reject) => {
            let idx = books.findIndex(book => book.id === id)
            if (idx === -1) {
                return reject('Book id is not true')
            }
            books.splice(idx, 1)
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'books.json'),
                JSON.stringify({ books }),
                (err) => {
                    if (err) reject(err)
                    else resolve()
                })
        })
    }
}

class Korzina {
    static async getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'korzina.json'), 'utf-8', (err, content) => {
                if (err) reject(err)
                else resolve(JSON.parse(content).books)
            })
        })
    }

    static async toKorzinaById(id, mode) {
        let books = await Korzina.getAll()

        return new Promise((resolve, reject) => {
            if (mode) {
                const findRes = books.find(book => book == id);

                if (findRes == undefined) {
                    books.push(id);
                }
            } else {
                const idx = books.findIndex(item => item == id);

                if (idx == -1) {
                    reject('Id not defined');
                    return
                }

                books.splice(idx, 1);
            }

            fs.writeFile(
                path.join(__dirname, '..', 'data', 'korzina.json'),
                JSON.stringify({ books }),
                (err) => {
                    if (err) reject(err);
                    else resolve('success');
                })
        })
    }

    static async getAllBooks() {
        const ids = await Korzina.getAll();
        const allBooks = await Books.getAll();
        const books = []

        ids.forEach(id => {
            allBooks.forEach(book => {
                if (book.id == id) {
                    books.push(book);
                }
            })
        });

        return books
    }

    static async getTotalPrice() {
        const books = await Korzina.getAllBooks();
        let totalPrice = 0

        books.forEach(book => {
            totalPrice += book.price;
        })

        return totalPrice;
    }
}

module.exports = { Books, Korzina }