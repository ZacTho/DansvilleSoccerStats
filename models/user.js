var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://zach:cuseorange11@soccerstats.ccnkvcm9gvph.us-east-1.rds.amazonaws.com:5432/SoccerStats');

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
}); 
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    } 

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('table has been successfully created, if one doesnt exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;