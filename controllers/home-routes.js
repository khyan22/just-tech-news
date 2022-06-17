const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
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
                attributes: {
                    //adds the username of the user that made the COMMENT
                    model: User,
                    attributes: ['username']
                }
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
        res.render('homepage', { posts });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;