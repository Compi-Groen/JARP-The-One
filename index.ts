const { MongoClient } = require('mongodb');

const fetch = require("node-fetch");

const express = require("express");
const app = express();
const fs = require("fs");
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const uri = "mongodb+srv://jarp:cvbn1234@cluster0.lkq9w.mongodb.net/TheOne?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });

interface BlacklistQuotes {
    "id": string,
    "dialog": string,
    "name": string
    "reden": string,
}



//API uitlezen
const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer LoCTCgLxIKZlgXKkIBn_'
}
let quotes = require("./public/json/quotes.json");
let movies = require("./public/json/movies.json");
let characters = require("./public/json/characters.json");

const uitlezenAPI = async () => {
    const rawQuotes = await fetch('https://the-one-api.dev/v2/quote', {
        headers: headers
    })
    quotes = await rawQuotes.json();
    fs.writeFile("./public/json/quotes.json", JSON.stringify(quotes), (err: any) => { });
    const rawMovies = await fetch('https://the-one-api.dev/v2/movie', {
        headers: headers
    })
    movies = await rawMovies.json();
    fs.writeFile("./public/json/movies.json", JSON.stringify(movies), (err: any) => { });
    const rawCharacters = await fetch('https://the-one-api.dev/v2/character', {
        headers: headers
    })
    characters = await rawCharacters.json();
    fs.writeFile("./public/json/characters.json", JSON.stringify(characters), (err: any) => { });
}
const proberenUitlezen = () => {
    try {
        uitlezenAPI();
    } catch (error) {
        console.log("API niet uitlezen");
    } finally {
        app.set("port", (process.env.PORT || 5000));
        app.set("view engine", "ejs");
        app.use(express.json({ limit: '1mb' }));
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(flash())
        app.use(session({
            secret: Math.floor(Math.random() * 1048576).toString(),
            resave: false,
            saveUninitialized: false
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(methodOverride('_method'))
        initializePassport(
            (email: any) => users.find((user: any) => user.email === email),
            (_id: any) => users.find((user: any) => user._id.toString() === _id)
        )
    }
}
proberenUitlezen();

app.get("/", (req: any, res: any) => {
    res.render("landingpage");
});

app.get("/home", (req: any, res: any) => {
    res.render("home", { login: req.isAuthenticated() });
});

app.get("/contact", (req: any, res: any) => {
    res.render("contact", { login: req.isAuthenticated() });
});

app.get("/favorites", checkAuthenticated, (req: any, res: any) => {
    res.render("favorites", { Favorites: req.user.favorite, login: req.isAuthenticated() });
});

app.get("/blacklists", checkAuthenticated, async (req: any, res: any) => {
    res.render("blacklists", { blacklist: req.user.blacklist, login: req.isAuthenticated() });
});

app.post("/removeBlacklist", checkAuthenticated, async (req: any, res: any) => {
    try {
        await client.connect();
        let index = req.user.blacklist.map((e: BlacklistQuotes) => e.id).indexOf(req.body.id);
        req.user.blacklist.splice(index, 1);
        await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        res.send();
    }
});

//quiz:
app.get("/quiz1", (req: any, res: any) => {
    if (req.isAuthenticated()) {
        res.render("quiz1", { login: req.isAuthenticated(), blacklist: req.user.blacklist });
    } else {
        res.render("quiz1", { login: req.isAuthenticated(), blacklist: [] });
    }
});
app.get("/quiz2", (req: any, res: any) => {
    if (req.isAuthenticated()) {
        res.render("quiz2", { login: req.isAuthenticated(), blacklist: req.user.blacklist });
    } else {
        res.render("quiz2", { login: req.isAuthenticated(), blacklist: [] });
    }
});
app.post("/resultaat", async (req: any, res: any) => {
    if (req.isAuthenticated()) {
        if (req.body.mode == 1) {
            if (req.body.punten > req.user.highScoreMode1) {
                try {
                    await client.connect();
                    req.user.highScoreMode1 = req.body.punten;
                    await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
                } catch (e) {
                    console.error(e);
                }
                finally {
                    await client.close();
                }
            }
            res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: true, highScore: req.user.highScoreMode1 });
        } else {
            if (req.body.punten > req.user.highScoreMode2) {
                try {
                    await client.connect();
                    req.user.highScoreMode2 = req.body.punten;
                    await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
                } catch (e) {
                    console.error(e);
                }
                finally {
                    await client.close();
                }
            }
            res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: true, highScore: req.user.highScoreMode2 });
        }
    } else {
        res.render("resultaat", { punten: req.body.punten, mode: req.body.mode, login: false, highScore: 87 });
    }
});


app.post("/addBlacklist", checkAuthenticated, async (req: any, res: any) => {
    try {
        await client.connect();

        let blacklistQuote: BlacklistQuotes = { id: req.body.id, dialog: req.body.quote, name: req.body.naam, reden: req.body.reden };
        req.user.blacklist.push(blacklistQuote);
        let result = await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        res.send();
    }
});

app.post("/BlacklistRedenAanpassen", checkAuthenticated, async (req: any, res: any) => {
    try {
        await client.connect();
        req.user.blacklist[req.user.blacklist.map((e: any) => e.id).indexOf(req.body.id)].reden = req.body.reden
        await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        res.redirect("/blacklists");
    }
});


app.listen(app.get("port"));


//Favorite
interface Favorite {
    naam: string,
    qoute: string,
    id: string,
    url: string
}
app.post("/addFavorite", checkAuthenticated, async (req: any, res: any) => {
    try {
        await client.connect();

        let url = "https://lotr.fandom.com/wiki/" + req.body.naam.replace(/ /g, "_");
        let nieuwFavorite: Favorite = { naam: req.body.naam, qoute: req.body.qoute, id: req.body.id, url: url }
        req.user.favorite.push(nieuwFavorite)
        await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
});
app.post("/removeFavorite", checkAuthenticated, async (req: any, res: any) => {
    try {
        await client.connect();
        let index = req.user.favorite.map((e: Favorite) => e.id).indexOf(req.body.id);
        req.user.favorite.splice(index, 1);
        await client.db().collection('Users').updateOne({ _id: req.user._id }, { $set: req.user });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
        res.send();
    }
});
app.post("/qouteFavorite", checkAuthenticated, (req: any, res: any) => {
    res.send(req.user.favorite.map((e: Favorite) => e.id).indexOf(req.body.id) > 0);
});
app.post("/allFavorite", checkAuthenticated, async (req: any, res: any) => {
    res.send(req.user.favorite);
});

function initializePassport(getUserByEmail: any, getUserById: any) {
    const authenticateUser = async (email: any, password: any, done: any) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user: any, done: any) => done(null, user._id))
    passport.deserializeUser((id: any, done: any) => {
        return done(null, getUserById(id))
    })
}



let users: any = []
const getUser = async () => {
    try {
        await client.connect();
        let cursor = client.db().collection('Users').find({});
        users = await cursor.toArray();
        console.log(users)
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}
getUser();


app.get('/login', checkNotAuthenticated, (req: any, res: any) => {
    res.render('login.ejs', { login: req.isAuthenticated() })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req: any, res: any) => {
    res.render('register.ejs', { login: req.isAuthenticated() })
})

app.post('/register', checkNotAuthenticated, async (req: any, res: any) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let newUser: any = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            highScoreMode1: 0,
            highScoreMode2: 0,
            favorite: [],
            blacklist: []
        }
        await client.connect();
        const result = await client.db().collection('Users').insertOne(newUser);
        newUser._id = result.insertedId;
        users.push(newUser);
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    } finally {
        await client.close();
    }
})

app.delete('/logout', (req: any, res: any) => {
    req.session.destroy()
    res.redirect('/home')
})

function checkAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    next()
}

app.use((req: any, res: any) => {
    res.render("error", { login: req.isAuthenticated() });
});
export { }