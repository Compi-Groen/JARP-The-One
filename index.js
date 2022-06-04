"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var MongoClient = require('mongodb').MongoClient;
var fetch = require("node-fetch");
var express = require("express");
var app = express();
var fs = require("fs");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var methodOverride = require('method-override');
var uri = "mongodb+srv://jarp:cvbn1234@cluster0.lkq9w.mongodb.net/TheOne?retryWrites=true&w=majority";
var client = new MongoClient(uri, { useUnifiedTopology: true });
//API uitlezen
var headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer LoCTCgLxIKZlgXKkIBn_'
};
var quotes = require("./public/json/quotes.json");
var movies = require("./public/json/movies.json");
var characters = require("./public/json/characters.json");
var uitlezenAPI = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rawQuotes, rawMovies, rawCharacters;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('https://the-one-api.dev/v2/quote', {
                    headers: headers
                })];
            case 1:
                rawQuotes = _a.sent();
                return [4 /*yield*/, rawQuotes.json()];
            case 2:
                quotes = _a.sent();
                fs.writeFile("./public/json/quotes.json", JSON.stringify(quotes), function (err) { });
                return [4 /*yield*/, fetch('https://the-one-api.dev/v2/movie', {
                        headers: headers
                    })];
            case 3:
                rawMovies = _a.sent();
                return [4 /*yield*/, rawMovies.json()];
            case 4:
                movies = _a.sent();
                fs.writeFile("./public/json/movies.json", JSON.stringify(movies), function (err) { });
                return [4 /*yield*/, fetch('https://the-one-api.dev/v2/character', {
                        headers: headers
                    })];
            case 5:
                rawCharacters = _a.sent();
                return [4 /*yield*/, rawCharacters.json()];
            case 6:
                characters = _a.sent();
                fs.writeFile("./public/json/characters.json", JSON.stringify(characters), function (err) { });
                return [2 /*return*/];
        }
    });
}); };
var proberenUitlezen = function () {
    try {
        uitlezenAPI();
    }
    catch (error) {
        console.log("API niet uitlezen");
    }
    finally {
        app.set("port", (process.env.PORT || 5000));
        app.set("view engine", "ejs");
        app.use(express.json({ limit: '1mb' }));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use(flash());
        app.use(session({
            secret: Math.floor(Math.random() * 1048576).toString(),
            resave: false,
            saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(methodOverride('_method'));
        initializePassport(function (email) { return users.find(function (user) { return user.email === email; }); }, function (_id) { return users.find(function (user) { return user._id.toString() === _id; }); });
    }
};
proberenUitlezen();
app.get("/", function (req, res) {
    res.render("landingpage");
});
app.get("/home", function (req, res) {
    res.render("home", { login: req.isAuthenticated() });
});
app.get("/contact", function (req, res) {
    res.render("contact", { login: req.isAuthenticated() });
});
app.get("/favorites", checkAuthenticated, function (req, res) {
    res.render("favorites", { Favorites: req.user.favorite, login: req.isAuthenticated() });
});
app.get("/blacklists", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("blacklists", { blacklist: req.user.blacklist, login: req.isAuthenticated() });
        return [2 /*return*/];
    });
}); });
app.post("/removeBlacklist", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                index = req.user.blacklist.map(function (e) { return e.id; }).indexOf(req.body.id);
                req.user.blacklist.splice(index, 1);
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                res.send();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
//quiz:
app.get("/quiz1", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("quiz1", { login: req.isAuthenticated(), blacklist: req.user.blacklist });
    }
    else {
        res.render("quiz1", { login: req.isAuthenticated(), blacklist: [] });
    }
});
app.get("/quiz2", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("quiz2", { login: req.isAuthenticated(), blacklist: req.user.blacklist });
    }
    else {
        res.render("quiz2", { login: req.isAuthenticated(), blacklist: [] });
    }
});
app.post("/resultaat", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_2, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.isAuthenticated()) return [3 /*break*/, 17];
                if (!(req.body.mode == 1)) return [3 /*break*/, 8];
                if (!(req.body.punten > req.user.highScoreMode1)) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, client.connect()];
            case 2:
                _a.sent();
                req.user.highScoreMode1 = req.body.punten;
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4:
                e_2 = _a.sent();
                console.error(e_2);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, client.close()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: true, highScore: req.user.highScoreMode1 });
                return [3 /*break*/, 16];
            case 8:
                if (!(req.body.punten > req.user.highScoreMode2)) return [3 /*break*/, 15];
                _a.label = 9;
            case 9:
                _a.trys.push([9, 12, 13, 15]);
                return [4 /*yield*/, client.connect()];
            case 10:
                _a.sent();
                req.user.highScoreMode2 = req.body.punten;
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 11:
                _a.sent();
                return [3 /*break*/, 15];
            case 12:
                e_3 = _a.sent();
                console.error(e_3);
                return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, client.close()];
            case 14:
                _a.sent();
                return [7 /*endfinally*/];
            case 15:
                res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: true, highScore: req.user.highScoreMode2 });
                _a.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: false, highScore: 87 });
                _a.label = 18;
            case 18: return [2 /*return*/];
        }
    });
}); });
app.post("/addBlacklist", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blacklistQuote, result, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                blacklistQuote = { id: req.body.id, dialog: req.body.quote, name: req.body.naam, reden: req.body.reden };
                req.user.blacklist.push(blacklistQuote);
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 6];
            case 3:
                e_4 = _a.sent();
                console.error(e_4);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                res.send();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post("/BlacklistRedenAanpassen", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                req.user.blacklist[req.user.blacklist.map(function (e) { return e.id; }).indexOf(req.body.id)].reden = req.body.reden;
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                e_5 = _a.sent();
                console.error(e_5);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                res.redirect("/blacklists");
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.listen(app.get("port"));
app.post("/addFavorite", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, nieuwFavorite, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                url = "https://lotr.fandom.com/wiki/" + req.body.naam.replace(/ /g, "_");
                nieuwFavorite = { naam: req.body.naam, qoute: req.body.qoute, id: req.body.id, url: url };
                req.user.favorite.push(nieuwFavorite);
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                e_6 = _a.sent();
                console.error(e_6);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post("/removeFavorite", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                index = req.user.favorite.map(function (e) { return e.id; }).indexOf(req.body.id);
                req.user.favorite.splice(index, 1);
                return [4 /*yield*/, client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user })];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                e_7 = _a.sent();
                console.error(e_7);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                res.send();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post("/qouteFavorite", checkAuthenticated, function (req, res) {
    res.send(req.user.favorite.map(function (e) { return e.id; }).indexOf(req.body.id) > 0);
});
app.post("/allFavorite", checkAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send(req.user.favorite);
        return [2 /*return*/];
    });
}); });
function initializePassport(getUserByEmail, getUserById) {
    var _this = this;
    var authenticateUser = function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = getUserByEmail(email);
                    if (user == null) {
                        return [2 /*return*/, done(null, false, { message: 'No user with that email' })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, bcrypt.compare(password, user.password)];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/, done(null, user)];
                    }
                    else {
                        return [2 /*return*/, done(null, false, { message: 'Password incorrect' })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_8 = _a.sent();
                    return [2 /*return*/, done(e_8)];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser(function (user, done) { return done(null, user._id); });
    passport.deserializeUser(function (id, done) {
        return done(null, getUserById(id));
    });
}
var users = [];
var getUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cursor, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                cursor = client.db().collection('Users').find({});
                return [4 /*yield*/, cursor.toArray()];
            case 2:
                users = _a.sent();
                console.log(users);
                return [3 /*break*/, 6];
            case 3:
                e_9 = _a.sent();
                console.error(e_9);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, client.close()];
            case 5:
                _a.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
getUser();
app.get('/login', checkNotAuthenticated, function (req, res) {
    res.render('login.ejs', { login: req.isAuthenticated() });
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/register', checkNotAuthenticated, function (req, res) {
    res.render('register.ejs', { login: req.isAuthenticated() });
});
app.post('/register', checkNotAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, newUser, result, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, 5, 7]);
                return [4 /*yield*/, bcrypt.hash(req.body.password, 10)];
            case 1:
                hashedPassword = _b.sent();
                newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    highScoreMode1: 0,
                    highScoreMode2: 0,
                    favorite: [],
                    blacklist: []
                };
                return [4 /*yield*/, client.connect()];
            case 2:
                _b.sent();
                return [4 /*yield*/, client.db().collection('Users').insertOne(newUser)];
            case 3:
                result = _b.sent();
                newUser._id = result.insertedId;
                users.push(newUser);
                res.redirect('/login');
                return [3 /*break*/, 7];
            case 4:
                _a = _b.sent();
                res.redirect('/register');
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, client.close()];
            case 6:
                _b.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
app["delete"]('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/home');
});
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home');
    }
    next();
}
app.use(function (req, res) {
    res.render("error", { login: req.isAuthenticated() });
});
