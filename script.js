const answers  = {}; //mappa per tenere traccia delle risposte
const boxes = document.querySelectorAll('.choice-grid div'); //lista di reference a tutte le caselle dichiarata globale dato che la userò in diverse funzioni
start();//aggiungo i listener a tutti le caselle
const button=document.querySelector('button'); //aggiungo il listener al button
button.addEventListener('click', restart);
function start(){ //dichiaro una funzione per poter poi "riclicare" lo stesso codice nella funzione restart
  for (const box of boxes) {
    box.addEventListener('click', onClick);
  }
}


function onClick(event){
    const divClicked = event.currentTarget;
    divClicked.classList.add('selected');
    const image = divClicked.querySelector('img.checkbox');
    image.src = "images/checked.png";
    divClicked.classList.remove('opacity'); //tolgo l'opacità era già presente per via di una selezione precedente
    answers[divClicked.dataset.questionId]=divClicked.dataset.choiceId; /*tengo traccia delle risposte date...per aggiornare la mappa non ho bisogno di cancellare
    in data posizione; mi basterà scrivere e quella posizione verrà sovrascritta*/ 
    addOpacity(divClicked); //aggiungo opacità alle caselle non selezionate
    if(answers.one && answers.two && answers.three){ //se tutte le caselle della mappa sono diverse da null (= ho inserito 3 scelte)
        for (const box of boxes) {
            box.removeEventListener('click', onClick);
        }
        displayWinner(calculateWinner());
    }
    
}

function addOpacity(selectedBox){
    for(const box of boxes)
        if(box.dataset.questionId === selectedBox.dataset.questionId && 
            box.dataset.choiceId !== selectedBox.dataset.choiceId){  //tutti quelle caselle della stessa domanda diverse da quella selezionata
            box.classList.add('opacity');
            box.classList.remove('selected'); //rimuovo lo stile selected da quella che era stata selezionata precedentemente
            const image1 = box.querySelector('img.checkbox');
            image1.src = "images/unchecked.png"
        }
}

function calculateWinner(){
        if(answers["two"] === answers["three"])
            return answers["two"];
        else return answers["one"]; /*la funzione dovrà ritornare answer[one] sia nel caso in cui le scelte sono tutte diverse sia nel caso 
        in cui answers[one] === answers[two] || answers[one] === answers[three] perché in quest'ultimo caso answer[one] è la risposta
        più frequente. L'unico caso in cui la risposta più frequente non è answers[one] è quello contemplato dal primo if. Nel caso in cui le
        risposte sono tutte e 3 uguali allorà saremo anche nella situazione del primo if*/
}

function displayWinner(winner){
    const result =document.querySelector('div#result');
    result.classList.remove('hidden');
    let text= result.querySelector('h1');
    text.textContent=RESULTS_MAP[winner].title;
    text= result.querySelector('p');
    text.textContent=RESULTS_MAP[winner].contents;
}

function restart(){
    start();
    for(const key in answers) //cancello la mappa
        delete answers[key];
    console.log(answers);
    const result = document.querySelector('div#result');
    result.classList.add('hidden');
    for(const box of boxes){
        box.classList.remove('opacity');
        box.classList.remove('selected');
        box.querySelector("img.checkbox").src = "images/unchecked.png";
    }
    
}