const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(store.bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;

        //check for title
        if(!title) {
            logger.error(`Title is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        //check for url
        if(!url) {
            logger.error(`URL is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        //check for description
        if(!description) {
            logger.error(`Description is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        //check for rating
        if(!rating) {
            logger.error(`Rating is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        //create an id
        const id = uuid();
        const bookmark = { id, title, url, description, rating }

        store.bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
        const { bookmark_id } = req.params
        const bookmark = store.bookmarks.find(c => c.id == bookmark_id)
        if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found')
            }
        
            res.json(bookmark)
    })
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


    module.exports = bookmarksRouter