const mode = 1;
let aantal = 0
const volgendeVraag = () => {
    if (aantal < 9) {
        aantal++;
        punten += puntenToevoegen;
        vraag();
    } else {
        resultaat();
    }
}