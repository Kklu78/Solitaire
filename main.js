class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.rank = ranks[value];
        //this.imgUrl = `../images/${suit.toLowerCase()}/${suit.toLowerCase()}-${['A', 'J', 'Q', 'K'].includes(value) ? value : `r${value}`}.svg`
        this.class = `${suit.toLowerCase()[0]}${value}`;
        this.revealed = false;
    }
}

//Initialize variables
let deck = []
const suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades']
const values = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K']
const nums = [1,2,3,4,5,6,7,8,9,10,11,12,13]
const ranks = {}
const cardsInWaste = [];
const cardsInFoundation = {
    foundation1:[],
    foundation2:[],
    foundation3:[],
    foundation4:[]
}

const cardsInTableau = {
    tableau1:[],
    tableau2:[],
    tableau3:[],
    tableau4:[],
    tableau5:[],
    tableau6:[],
    tableau7:[]
}



//functions
function init(){
    generateDeck();
    shuffleDeck();
    distributeDeck();
    revealTopCards();
    renderBoard();



}
//render functions
function renderBoard(){
    renderStack()
    renderPiles()

}

function renderStack(){
    for (stack in cardsInTableau){
        let tempHTML = ''
        if (cardsInTableau[stack].length === 0) {
            tempHTML = `\n <span class='card outline'></span>`
        } else {
            for (let i = 0; i < Number(cardsInTableau[stack].length); i++) {
                tempHTML += `\n <span class='card ${cardsInTableau[stack][i].revealed ? `${cardsInTableau[stack][i].class}' draggable='true'  ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"`  : 'back-blue'}' style='position: relative; top: ${-128*i}px; z-index: ${i};' '></span>`
            }
        }
        document.querySelector(`#${stack}`).innerHTML = tempHTML

    }
   
}

function revealTopCards() {
    for (stack in cardsInTableau){
        cardsInTableau[stack][cardsInTableau[stack].length-1].revealed = true
    }

}

function renderPiles() {
    if (cardsInWaste.length > 0) {
        document.querySelector('#waste').classList = `card ${cardsInWaste[cardsInWaste.length-1].class}`
    } else {
        document.querySelector('#waste').classList = 'card outline'
    }

    for (pile in cardsInFoundation) {
        if (cardsInFoundation[pile].length > 0) {
            document.querySelector(`#${pile}`).classList = `card ${cardsInFoundation[pile][cardsInFoundation[pile].length-1].class}`
        } else {
            document.querySelector(`#${pile}`).classList = 'card outline'
        }
    }

    if (deck.length === 0) {
        document.querySelector('#deck').classList = 'card outline'
    }
}

//deck functions
function generateDeck(){
    values.forEach((value,i) => ranks[value] = nums[i])
    suits.forEach((x) => {
        for (j in ranks) {
            deck.push(new Card(x,j))
        }
    })
}

function shuffleDeck(){
    tempDeck = []
    while (deck.length>0) {
        index = Math.floor(Math.random()*deck.length)
        tempDeck.push(deck.splice(index,1)[0])
    }
    deck = deck.concat(tempDeck)
}

function distributeDeck() {
    for (stack in cardsInTableau) {
        for (let i = 0; i < Number(stack[stack.length-1]); i++) {
            cardsInTableau[stack].push(deck.pop())
        }
        
    }
    

}

//action Functions

function dealCard() {

}

function moveCard(x,y) {

}

function checkLegal(card1,card2) {
    // if () {

    // }
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
function drag(ev) {
    let parent = ev.target.parentNode.id
    console.dir(ev.target.classList[1])
    
    if (parent.includes('tableau')) {
        index = cardsInTableau[parent].findIndex(card => card.class === ev.target.classList[1])
        splice = cardsInTableau[parent].splice(index, cardsInTableau[parent].length-index)
        console.dir(ev.target)
        console.log(cardsInTableau[parent].length-index)
        console.log(splice)
        // console.log(cardsInTableau[parent].length)
    }
    
    
    
    // ev.dataTransfer.setData("card", );
  }
  
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("card");

    // console.dir(ev.target.parentElement)

  }

init()