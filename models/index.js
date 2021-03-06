const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

//connects to post using one to many relationship
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//connects to post using many to many relationship and through Vote table
User.belongsToMany(Post, {
    through: Vote, 
    as: 'voted_posts',
    foreignKey: 'user_id'
});

//connects user to vote
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

//connects to User table 
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

//connects post to user
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

//connects to user table
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

//connects to user
Vote.belongsTo(User, {
    foreignKey: 'user_id',
});

//connects to post
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };