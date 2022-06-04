//require('blacklist.ts');

//haalt de id van een willekeurige quote op om later te gebruiken
const fetchQuote = async () => {
  if (login) {
    let opgehaaldeQuote = "";
    let isgeblacklist = false;

    const geblacklist = await black;

    while (opgehaaldeQuote == "") {
      const rawQuotes = await fetch("./json/quotes.json");
      const quotes = await rawQuotes.json();
      const quote = quotes.docs[Math.floor(Math.random() * quotes?.docs?.length)];

      for (let i = 0; i < geblacklist.length; i++) {
        if (quote == geblacklist[i].id) {
          isgeblacklist = true;
        }
      }
      if (!isgeblacklist) {
        opgehaaldeQuote = await quote;
      }
    }
    return await opgehaaldeQuote;
  } else {
    const rawQuotes = await fetch("./json/quotes.json");
    const quotes = await rawQuotes.json();
    const quote = quotes.docs[Math.floor(Math.random() * quotes?.docs?.length)];
    return await quote;
  }
};
//haalt de tekst die bij de id hoort op
//haalt de film op waarin de quote is gezegd
const fetchMovie = async () => {

  const rawMovies = await fetch("./json/movies.json");
  const movies = await rawMovies.json();
  for (let i = 0; i < movies.docs.length; i++) {
    if (quote.movie == movies.docs[i]._id) {
      const movie = movies.docs[i];
      return movie.name;
    }
  }
}
//haalt het karakter op die de quote heeft gezegd
const fetchCharacter = async () => {

  const rawCharacters = await fetch("./json/characters.json");
  const characters = await rawCharacters.json();

  for (let i = 0; i < characters.docs.length; i++) {
    if (quote.character == characters.docs[i]._id) {
      const character = characters.docs[i];
      return character.name;
    }
  }
}
//haalt een willekeurig karakter op
const fetchRandomCharacter = async () => {
  const rawCharacters = await fetch("./json/characters.json");
  const characters = await rawCharacters.json();
  const character = characters.docs[Math.floor(Math.random() * characters?.docs?.length)];
  return character.name;
}

const pTagScore = document.getElementById("score");
const pTagAantal = document.getElementById("aantal")
let punten = 0;
let quote, movie, character, randomCharacter1, randomCharacter2, puntenToevoegen, filmGeklikt, karGeklikt, chararray;
//zet alle opgehaalde waarden in variabelen
const vraag = async () => {
  quote = await fetchQuote();
  movie = await fetchMovie();
  character = await fetchCharacter();
  randomCharacter1 = await fetchRandomCharacter();
  randomCharacter2 = await fetchRandomCharacter();

  if (login) {
    document.getElementById("favorite").className = "";
    document.getElementById("reden").className = "";
    quizFavorite();

  }

  puntenToevoegen = 0;
  filmGeklikt = false;
  karGeklikt = false;

  //zet de 3 karakters in een array en shuffelt die
  chararray = await [character, randomCharacter1, randomCharacter2];
  chararray = await chararray.sort(function (a, b) { return 0.5 - Math.random() });

  // console.log(quote);
  console.log(character);
  console.log(movie);

  document.getElementById("filmQuote").innerHTML = quote.dialog;
  film1.className = "";
  film2.className = "";
  film3.className = "";
  kar0.className = "";
  kar1.className = "";
  kar2.className = "";
  volgendeKnop.className = "gedrukt";
  document.getElementById("kar0").innerHTML = chararray[0];
  document.getElementById("kar1").innerHTML = chararray[1];
  document.getElementById("kar2").innerHTML = chararray[2];

  pTagScore.innerText = `Score: ${punten}`;
  if (mode == 1) {
    pTagAantal.innerHTML = `${aantal + 1}/10`;
  } else {
    pTagAantal.style = "display:none"
  }
}
//kijkt na of op de knop van het juiste karakter word geklikt, en veranderd dan naar de gepaste kleur



const kar0 = document.getElementById("kar0");

kar0.addEventListener("click", function () {
  if (karGeklikt == false) {
    klikKarakters()
    if (chararray[0] == character) {
      puntenToevoegen += 0.5;
    } else {
      kar0.className = 'gedrukt fout';
    }
    karGeklikt = true;
    volgendeVraagteken()
  }
});

const kar1 = document.getElementById("kar1");
kar1.addEventListener("click", function () {
  if (karGeklikt == false) {
    klikKarakters()
    if (chararray[1] == character) {
      puntenToevoegen += 0.5;
    } else {
      kar1.className = 'gedrukt fout';
    }
    karGeklikt = true;
    volgendeVraagteken()
  }
});

const kar2 = document.getElementById("kar2");
kar2.addEventListener("click", function () {
  if (karGeklikt == false) {
    klikKarakters()
    if (chararray[2] == character) {
      puntenToevoegen += 0.5;
    } else {
      kar2.className = 'gedrukt fout';
    }
    karGeklikt = true;
    volgendeVraagteken()
  }
});

const klikKarakters = () => {
  kar0.className = 'gedrukt';
  kar1.className = 'gedrukt';
  kar2.className = 'gedrukt';
  if (chararray[0] == character) {
    kar0.className = 'gedrukt goed';
  } else if (chararray[1] == character) {
    kar1.className = 'gedrukt goed';
  } else if (chararray[2] == character) {
    kar2.className = 'gedrukt goed';
  }
}

const film1 = document.getElementById("FOTR");
film1.addEventListener("click", function () {
  if (filmGeklikt == false) {
    klikFilms()
    if (movie == "The Fellowship of the Ring") {
      puntenToevoegen += 0.5;
    } else {
      film1.className = 'gedrukt fout';
    }
    filmGeklikt = true;
    volgendeVraagteken()
  }
});


const film2 = document.getElementById("TTT");

film2.addEventListener("click", function () {
  if (filmGeklikt == false) {
    klikFilms()
    if (movie == "The Two Towers ") {
      puntenToevoegen += 0.5;
    } else {
      film2.className = 'gedrukt fout';
    }
    filmGeklikt = true;
    volgendeVraagteken()
  }
});


const film3 = document.getElementById("TROTK");

film3.addEventListener("click", function () {
  if (filmGeklikt == false) {
    klikFilms()
    if (movie == "The Return of the King") {
      puntenToevoegen += 0.5;
    } else {
      film3.className = 'gedrukt fout';
    }
    filmGeklikt = true;
    volgendeVraagteken()
  }
});

const klikFilms = () => {
  film1.className = 'gedrukt';
  film2.className = 'gedrukt';
  film3.className = 'gedrukt';
  if (movie == "The Fellowship of the Ring") {
    film1.className = 'gedrukt goed';
  } else if (movie == "The Two Towers ") {
    film2.className = 'gedrukt goed';
  } else if (movie == "The Return of the King") {
    film3.className = 'gedrukt goed';
  }
}

const volgendeKnop = document.getElementById("volgende");
volgendeKnop.addEventListener("click", function () {
  if (filmGeklikt && karGeklikt) {
    volgendeVraag();
  }
})
const volgendeVraagteken = () => {
  if (filmGeklikt && karGeklikt) {
    volgendeKnop.className = ""
  }
}

const resultaat = () => {
  let xhr = new XMLHttpRequest();
  let url = "/resultaat";

  // open a connection
  xhr.open("POST", url, true);
  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      document.open();
      document.write(this.response);
      document.close();
    }
  }

  // Converting JSON data to string
  var data = JSON.stringify({ "mode": mode, "punten": punten });

  // Sending data with the request
  xhr.send(data);
}

vraag();