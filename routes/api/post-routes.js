const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Vote, Comment } = require('../../models');

//get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
     .then(dbPostData => res.json(dbPostData))
     .catch(err => {
         console.log(err);
         res.status(500).json(err);
     });
});

// get single posts
router.get('/:id', (req, res) => {
    Post.upvote(req.body,  { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create posts
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
})

//PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    }).then(() => {
        //find post voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',

                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ]
        })
    }).then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
});
 
// update posts
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            } 
        }   
    ).then(dbPostData => { 
        if (!dbPostData) {
            res.status(404).json({ message: 'Post not found.'});
            return;
        }
        res.json(dbPostData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'Post not found.'});
            return;
        }
        res.json(dbPostData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;