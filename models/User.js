const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create user model
class User extends Model {};

//define table columns and configuration
User.init(
    {
        id: {
            // defines the datatype
            type: DataTypes.INTEGER,
            // NOT NULL equivalent
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // makes password atleast 4 characters long
                len:[4]
            }
        }
    },
    {
        // pass in imported sequelize connection (direct connection to db)
        sequelize,
        // timestamps give two time related attributes to obj (createdAt & updatedAt)
        timestamps: false,
        // freezeTableName if true stops sequelize from turning all model names into plural(it does this by default)
        freezeTableName: true,
        // use underscores instead of camel casing
        underscored: true,
        // makes what ever you write the name in db
        modelName: 'user'
    }
);

module.exports = User;