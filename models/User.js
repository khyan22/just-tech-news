const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
};

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
            allowNull: false,
            validate: {
                len:[4]
            } 
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
                // makes password at least 4 characters long
                len:[8]
            }
        },
    },
    {
        hooks: {
            //hook
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            }
        },

        // pass in imported sequelize connection (direct connection to db)
        sequelize,
        // timestamps give two time related attributes to obj (createdAt & updatedAt)
        timestamps: false,
        // freezeTableName if true stops sequelize from turning all model names into plural(it does this by default)
        freezeTableName: true,
        // use underscores instead of camel casing
        underscored: true,
        // names the table
        modelName: 'user'
    }
);

module.exports = User;