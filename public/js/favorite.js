let bestaatQouteAlsFavorite = false;

const quizKnopFavorite = () => {
    if (bestaatQouteAlsFavorite) {
        document.getElementById("favorite").className = "";
        removeFavorite(quote._id,false);
        bestaatQouteAlsFavorite = false;
    } else {
        bestaatQouteAlsFavorite = true;
        document.getElementById("favorite").className = "goed";
        addFavorite(character, quote.dialog, quote._id);
    }
}

const removeFavoriteKnop = (id) => {
    removeFavorite(id,true);
    //document.getElementById(id).style.display = "none";
}

const addFavorite = (naam, qoute, id) => {
    let xhr = new XMLHttpRequest();
    let url = "/addFavorite";

    // open a connection
    xhr.open("POST", url, true);
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    var data = JSON.stringify({ "naam": naam, "qoute": qoute, "id": id });

    // Sending data with the request
    xhr.send(data);
}

const removeFavorite = (id,herlaad) => {
    let xhr = new XMLHttpRequest();
    let url = "/removeFavorite";

    // open a connection
    xhr.open("POST", url, true);
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if (herlaad){
                location.reload();
            }
        }
    }
    // Converting JSON data to string
    var data = JSON.stringify({ "id": id });

    // Sending data with the request
    xhr.send(data);
}

const quizFavorite = () => {
    let xhr = new XMLHttpRequest();
    let url = "/qouteFavorite";

    // open a connection
    xhr.open("POST", url, true);
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            bestaatQouteAlsFavorite = this.response == 'true';
            if (bestaatQouteAlsFavorite) {
                document.getElementById("favorite").className = "goed";
            } else {
                document.getElementById("favorite").className = "";
            }
        }
    }
    // Converting JSON data to string
    var data = JSON.stringify({ "id": quote._id });

    // Sending data with the request
    xhr.send(data);
}



const afdrukken = () => {
    let xhr = new XMLHttpRequest();
    let url = "/allFavorite";

    // open a connection
    xhr.open("POST", url, true);
    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let fav = JSON.parse(this.response);

            let text = "";
            for (let i = 0; i < fav.length; i++) {
                text += fav[i].qoute + " - " + fav[i].naam + "\n";
            }
            let data = new Blob([text], { type: 'text/plain' });
            let url = URL.createObjectURL(data);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = url;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'favorites.txt';
            hiddenElement.click();
        }
    }
    // Sending data with the request
    xhr.send(JSON.stringify({ "dd": "dd" }));
}