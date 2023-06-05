const { addBookHandler, getAllBooksHandler, getBookHandler, editBookHandler, deleteBookHandler } = require("./handler");

const routes = [
    {
        method: "POST",
        path: "/books",
        handler: addBookHandler,
        
    },
    {
        method: "GET",
        path: "/books",
        handler: getAllBooksHandler,
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: getBookHandler,
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: editBookHandler,
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: deleteBookHandler,
    },
];

module.exports = routes;