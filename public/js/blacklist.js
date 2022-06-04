let isAlGeblacklist = false;
let redenTekst;

const blacklistKnoppen = document.getElementsByClassName('blacklistKnop');

for (let i = 0; i < blacklistKnoppen.length; i++) {
  const button = blacklistKnoppen[i];
  button.addEventListener("click", function () {
    let elements = button.parentNode.children;
    for (let i = 0; i < elements.length; i++) {
      let form = elements[i];
      if (form == button) {
        form = elements[i + 1];
        if (form.className.length > 0) {
          form.className = "";
        } else {
          form.className = "zichtbaar";
        }
      }
    }
  });
}

const quizKnopBlacklist = () => {
  if (isAlGeblacklist) {
    //document.getElementById('blacklist').className = "";
    removeBlacklist(quote._id);
    isAlGeblacklist = false;
  } else {
    isAlGeblacklist = true;
    //document.getElementById('blacklist').className = "goed";
    redenTekst = document.getElementById('areaReden').value;
    addBlacklist(character, quote.dialog, quote._id, redenTekst);
  }
}

const addBlacklist = (naam, quote, id, redenTekst) => {
  let xhr = new XMLHttpRequest();
  let url = "/addBlacklist";

  //open a connection
  xhr.open("POST", url, true);
  //set the request header
  xhr.setRequestHeader("Content-Type", "application/json");

  //converting json data string
  var data = JSON.stringify({ "naam": naam, "quote": quote, "id": id, "reden": redenTekst });

  //sending data with the request
  xhr.send(data);
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      vraag();
    }
  }
}

const removeBlacklist = (id) => {
  let xhr = new XMLHttpRequest();
  let url = "/removeBlacklist";
  console.log(id);

  //open a connection
  xhr.open("POST", url, true);
  //set the request header
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      location.reload();
    }
  }

  //converting json data string
  var data = JSON.stringify({ "id": id });

  //sending data with the request
  xhr.send(data);
}

const quizBlacklist = () => {
  let xhr = new XMLHttpRequest();
  let url = "/removeBlacklist";

  //open a connection
  xhr.open("POST", url, true);
  //set the request header
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {//call a function when the state changes
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      isAlGeblacklist = this.response == 'true';
      if (isAlGeblacklist) {
        document.getElementById("blacklist").className = "fout";
      } else {
        document.getElementById("blacklist").className = "";
      }
    }
  }
  var data = JSON.stringify({ "id": quote._id });

  //sending data with the request
  xhr.send(data);
}
