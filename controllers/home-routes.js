const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

//homepage route
router.get('/', (req, res) => {
    console.log(req.session);
    //gets all the post date we need
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                //includes every comment attached to the post
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: [
                    {
                    //adds the username of the user that made the COMMENT
                    model: User,
                    attributes: ['username']
                    }
                ]
            },
            {
                //add the username of the user that made the POST
                model: User,
                attributes: ['username']
            }
        ]
        //takes every post from the table and puts it into an array that passed into the .then() promise 
    }).then(dbPostData => {
        //the post is referring to each individual post in the array
        //.map(post)is taking all the post from the arraying and with an arrow function is leading them to,
        //the get({ plain: true }) is serializing the data we're getting from findAll()
        const posts = dbPostData.map(post => post.get({ plain: true }));
        //the 'homepage' is referring to the homepage.handlebars and { post } is giving the render the attributes it needs
        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//login render route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

//single post page route
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }

        //serialize the data
        const post = dbPostData.get({ plain: true });

        //pass data into template
        res.render('single-post', { 
            post,
            loggedIn: req.session.loggedIn
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;