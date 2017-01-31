var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config.js'),
    sectretKey = config.secretKey;
var userSchema = new Schema({
    firstname: { type: String, reuired: true },
    lastname: { type: String, reuired: true },
    username: { type: String, reuired: true, index: true, unique: true },
    email: { type: String, reuired: true, unique: true },
    age: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        min: 18, max: 65
    },
    contact: {
        type: Number,
        required: true
    },
    password: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    roles: {
        type: [{
            type: String,
            enum: ['member', 'admin']
        }],
        default: ['member']
    },
    updated: {
        type: Date
    },
    isActive: { type: Boolean, default: false },
    rooms: {
        type: [ {
                type: Schema.Types.ObjectId,
                ref: 'rooms'
           
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 12']
    }

});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) next(err);
        user.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}
userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, sectretKey); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var roomSchema = new Schema({
    roomname: { type: String, reuired: true, index: true, unique: true },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: { type: Date, default: Date.now },
    members: {
        type: [{
            
                type: Schema.Types.ObjectId,
                ref: 'users'
           
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 12']
    }

});
function arrayLimit(val) {
    return val.length <= 12;
}
module.exports.user = mongoose.model('users', userSchema);
module.exports.room = mongoose.model('rooms', roomSchema);