const { nanoid } = require("nanoid");
const bookshelf = require("./books");

const addBookHandler = (request, handler) => {
    
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading
    } = request.payload;

    const id = nanoid(16);
    const finished = readPage === pageCount;

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const cBook = { 
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        finished, 
        reading, 
        insertedAt, 
        updatedAt 
    };

    let response;

    // Data Validation Step
    if (name === "" || name === undefined) {
        response = handler.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
    
        response.code(400);        
        return response;
    }
    
    if (readPage > pageCount) {
        response = handler.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
    
        response.code(400);   
        return response; 
    }

    // Push book to bookshelf array if passed the data validation
    bookshelf.push(cBook);

    const isValid = bookshelf.filter((book) => book.id === id).length > 0;

    if (isValid) {

        response = handler.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            },
        });

        response.code(201);
    }
    else {
        response = handler.response({
            status: "fail",
            message: "Gagal menambahkan buku. Id telah digunakan"
        });
    
        response.code(500);    
    }

    return response;
};

const getAllBooksHandler = (request) => {

    const { name, finished, reading } = request.query;

    let books = [];

    bookshelf.forEach(book => {
        let cDisplayBook = {
            id: book.id,
            name: book.name,
            publisher: book.publisher
        };

        // Filter books based on the keywords
        if (name !== undefined) {
            if (book.name.toLowerCase().includes(name.toLowerCase()))
                books.push(cDisplayBook);
            return;
        } 
        
        // Filter books based on the finished condition
        if (finished !== undefined) {
            if (book.finished === (finished == 1))
                books.push(cDisplayBook);
            return;
        } 
        
        // Filter books based on the reading condition
        if (reading !== undefined) {
            if (book.reading === (reading == 1))
                books.push(cDisplayBook);
            return;
        }
    
        // Includes all books
        books.push(cDisplayBook);
        
    });

    return ({
        status: "success",
        data: { books }
    });
};

const getBookHandler = (request, handler) => {

    const { bookId } = request.params;

    const book = bookshelf.filter((note) => note.id === bookId)[0];

    let response;

    if (book === undefined) 
    {
        response = handler.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        });

        response.code(404);
    }
    else
    {
        
        if (book.pageCount === book.readPage) {
            book.finished = true;
            book.reading = false;
        }

        response = {
            status: "success",
            data: { book }
        };    
    }

    return response;
    
};

const editBookHandler = (request, handler) => {
    
    const { bookId } = request.params;
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading
    } = request.payload;

    const updatedAt = new Date().toISOString();

    const bookIndex = bookshelf.findIndex((book) => book.id === bookId);

    let response;

    if (bookIndex < 0) {
        response = handler.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        });
        
        response.code(404);
        return response;
    }

    if (name === "" || name === undefined) {
        response = handler.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
    
        response.code(400);        

        return response;
    }
    
    if (readPage > pageCount) {
        response = handler.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
    
        response.code(400);    
        return response;
    }

    bookshelf[bookIndex].name = name;
    bookshelf[bookIndex].year = year;
    bookshelf[bookIndex].author = author;
    bookshelf[bookIndex].summary = summary;
    bookshelf[bookIndex].publisher = publisher;
    bookshelf[bookIndex].pageCount = pageCount;
    bookshelf[bookIndex].readPage = readPage;
    bookshelf[bookIndex].reading = reading;
    bookshelf[bookIndex].updatedAt = updatedAt;
    
    response = handler.response({
        status: "success",
        message: "Buku berhasil diperbarui"
    });

    response.code(200);
    return response;
};

const deleteBookHandler = (request, handler) => 
{
    const { bookId } = request.params;

    const bookIndex = bookshelf.findIndex((note) => note.id === bookId);

    let response;

    if (bookIndex < 0) {
        response = handler.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        });
        
        response.code(404);
        return response;
    }

    bookshelf.splice(bookIndex, 1);
    response = handler.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });

    response.code(200);
    return response;

};

module.exports = { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookHandler, 
    editBookHandler, 
    deleteBookHandler
};