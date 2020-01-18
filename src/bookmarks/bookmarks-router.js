const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
    })

    .post(bodyParser, (req, res, next) => {
        const { title, url, description, rating } = req.body;
        const newBookmark = { title, url, description, rating }

        for (const [key, value] of Object.entries(newBookmark)) {
            if (value == null)
                logger.error(`${key} is required`)
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body`}
                })
            }

        
        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                logger.info(`Bookmark with id ${bookmark.id} created`)
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(bookmark)
            })
            .catch(next)

        /* OLD POST CODE
        const id = uuid();
        const bookmark = { id, title, url, description, rating }

        store.bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(bookmark)
        */
    })

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const { bookmark_id } = req.params
        BookmarksService.getById(knexInstance, bookmark_id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${bookmark_id} not found.`)
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }
                res.bookmark = bookmark // save bookmark for next middleware
                next()  // call next so the next middleware happens
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(bookmark)
    })
    .delete((req, res, next) => {
        BookmarksService.deleteBookmark(
            req.app.get('db'),
            req.params.bookmark_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

    /*
    .delete((req, res) => {
        const { bookmark_id } = req.params
    
        const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)
    
        if (bookmarkIndex === -1) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`)
          return res
            .status(404)
            .send('Bookmark Not Found')
        }
    
        store.bookmarks.splice(bookmarkIndex, 1)
    
        logger.info(`Bookmark with id ${bookmark_id} deleted.`)
        res
          .status(204)
          .end()
      })
      */


    module.exports = bookmarksRouter