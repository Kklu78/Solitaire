class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.rank = ranks[value];
        //this.imgUrl = `../images/${suit.toLowerCase()}/${suit.toLowerCase()}-${['A', 'J', 'Q', 'K'].includes(value) ? value : `r${value}`}.svg`
        this.class = `${suit.toLowerCase()[0]}${value}`;
        this.revealed = false;
        this.isRed = ['Diamonds', 'Hearts'].includes(suit) ? true : false;
    }
}

//Initialize variables
let deck = []
let suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades']
let values = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K']
let nums = [1,2,3,4,5,6,7,8,9,10,11,12,13]
let ranks = {}
let cardsInWaste = [];
let cardsInFoundation = {
    foundation1:[],
    foundation2:[],
    foundation3:[],
    foundation4:[]
}

let cardsInTableau = {
    tableau1:[],
    tableau2:[],
    tableau3:[],
    tableau4:[],
    tableau5:[],
    tableau6:[],
    tableau7:[]
}



//init function
function init(){
    deck = []
    cardsInWaste = [];
    cardsInFoundation = {
        foundation1:[],
        foundation2:[],
        foundation3:[],
        foundation4:[]
    }

    cardsInTableau = {
        tableau1:[],
        tableau2:[],
        tableau3:[],
        tableau4:[],
        tableau5:[],
        tableau6:[],
        tableau7:[]
    }
    document.querySelector('.win').style.opacity = '0'

    generateDeck();
    shuffleDeck();
    distributeDeck();
    renderBoard();



}
//render functions
function renderBoard(){
    revealTopCards();
    renderStack()
    renderPiles()
    limitBoard()
    winCondition()

}

function renderStack(){
    for (stack in cardsInTableau){
        let tempHTML = ''
        if (cardsInTableau[stack].length === 0) {
            tempHTML = `\n <span class='card outline' ondrop="drop(event)" ondragover="allowDrop(event)"></span>`
        } else {
            for (let i = 0; i < Number(cardsInTableau[stack].length); i++) {
                tempHTML += `\n <span class='card ${cardsInTableau[stack][i].revealed ? `${cardsInTableau[stack][i].class} revealed' draggable='true'  ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"`  : 'back-blue'}' style='position: relative; top: ${-128*i}px; z-index: ${i};' '></span>`
            }
        }
        document.querySelector(`#${stack}`).innerHTML = tempHTML

    }
   
}

function revealTopCards() {
    for (stack in cardsInTableau){
        if (cardsInTableau[stack].length === 0) {
            tempHTML = `\n <span class='card outline'></span>`
        } else {
        cardsInTableau[stack][cardsInTableau[stack].length-1].revealed = true
        }
    }

}

function renderPiles() {
    if (cardsInWaste.length > 0) {
        document.querySelector('#waste').innerHTML = `<span class='card ${cardsInWaste[cardsInWaste.length-1].class} revealed' draggable='true'  ondragstart="drag(event)"></span>`

    } else {
        document.querySelector('#waste').firstElementChild.classList = 'card outline'
    }

    for (pile in cardsInFoundation) {
        if (cardsInFoundation[pile].length > 0) {
            document.querySelector(`#${pile}`).innerHTML = `<span class='card ${cardsInFoundation[pile][cardsInFoundation[pile].length-1].class} revealed' draggable='true'  ondragstart="drag(event)"></span>`
        } else {
            document.querySelector(`#${pile}`).innerHTML = `\n <span class='card outline' ondrop="drop(event)" ondragover="allowDrop(event)"></span>`
        }
    }

    if (deck.length > 0) {
        document.querySelector('#deck').classList = 'card back-blue'
    } else {document.querySelector('#deck').classList = 'card outline'}

    
}

function limitBoard(){
    document.querySelector('html').style.width = '600px'
    document.querySelector('html').style.height = '600px'

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
//event listeners
document.querySelector('#deck').addEventListener('click', dealCard)
document.querySelector('.newGame').addEventListener('click', init)
document.querySelector('.winGame').addEventListener('click', winGame)




//action Functions

function dealCard() {
    deck.length > 0 ? cardsInWaste.push(deck.pop()) 
    : resetDeck()
    renderBoard()
}

function resetDeck(){
    deck = deck.concat(cardsInWaste)
    deck = deck.reverse()
    cardsInWaste = []
    renderBoard();
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
function drag(ev) {
    let parent = ev.target.parentNode.id
    let index = parent.includes('tableau') ? cardsInTableau[parent].findIndex(card => card.class === ev.target.classList[1]) 
    : parent.includes('waste') ? cardsInWaste.findIndex(card => card.class === ev.target.classList[1])
    : cardsInFoundation[parent].findIndex(card => card.class === ev.target.classList[1])
    ev.dataTransfer.setData('card', `${parent}, ${index}`)
 }
  
function drop(ev) {
    ev.preventDefault();
    
    const dragParent = ev.dataTransfer.getData("card").split(',')[0]
    const dragIndex = Number(ev.dataTransfer.getData("card").split(',')[1]);
    const dropParent = ev.target.parentNode.id
//tableau to tableau
    if (dragParent.includes('tableau') && dropParent.includes('tableau') && cardsInTableau[dropParent].length > 0) {
        const dropIndex = cardsInTableau[dropParent].findIndex(card => card.class === ev.target.classList[1])
        if (checkLegalTableau(returnCard(dragParent,dragIndex),returnCard(dropParent,dropIndex))){
            splice = cardsInTableau[dragParent].splice(dragIndex, cardsInTableau[dragParent].length-dragIndex)
            cardsInTableau[dropParent] = cardsInTableau[dropParent].concat(splice)
            renderBoard();
        }
//tableau to foundation with cards
    } else if (dragParent.includes('tableau') && dropParent.includes('foundation') && (cardsInTableau[dragParent].length-dragIndex) === 1 && cardsInFoundation[dropParent].length > 0) {
        const dropIndex = cardsInFoundation[dropParent].findIndex(card => card.class === ev.target.classList[1])
        if (checkLegalFoundation(returnCard(dragParent,dragIndex),returnCard(dropParent,dropIndex))){
            splice = cardsInTableau[dragParent].splice(dragIndex, cardsInTableau[dragParent].length-dragIndex)
            cardsInFoundation[dropParent] = cardsInFoundation[dropParent].concat(splice)
            renderBoard();
        }
//tableau to foundation without cards
    } else if (dragParent.includes('tableau') && dropParent.includes('foundation') && (cardsInTableau[dragParent].length-dragIndex) === 1 && cardsInFoundation[dropParent].length === 0) {
        if (checkLegalFoundationInit(returnCard(dragParent,dragIndex))){
            splice = cardsInTableau[dragParent].splice(dragIndex, cardsInTableau[dragParent].length-dragIndex)
            cardsInFoundation[dropParent] = cardsInFoundation[dropParent].concat(splice)
            renderBoard();
        }
//waste to tableau with cards
    } else if (dragParent.includes('waste') && dropParent.includes('tableau') && cardsInTableau[dropParent].length > 0) {
        const dropIndex = cardsInTableau[dropParent].findIndex(card => card.class === ev.target.classList[1])
        if (checkLegalTableau(returnCard(dragParent,dragIndex),returnCard(dropParent,dropIndex))){
            splice = cardsInWaste.splice(dragIndex, cardsInWaste.length-dragIndex)
            cardsInTableau[dropParent] = cardsInTableau[dropParent].concat(splice)
            renderBoard();
        }
//waste to foundation without cards
    } else if (dragParent.includes('waste') && dropParent.includes('foundation') && cardsInFoundation[dropParent].length === 0) {
        if (checkLegalFoundationInit(returnCard(dragParent,dragIndex))){
            splice = cardsInWaste.splice(dragIndex, cardsInWaste.length-dragIndex)
            console.log(splice)
            cardsInFoundation[dropParent] = cardsInFoundation[dropParent].concat(splice)
            renderBoard();
        }
//waste to foundation with cards
    } else if (dragParent.includes('waste') && dropParent.includes('foundation')) {
        const dropIndex = cardsInFoundation[dropParent].findIndex(card => card.class === ev.target.classList[1] && cardsInFoundation[dropParent].length > 0)
        if (checkLegalFoundation(returnCard(dragParent,dragIndex),returnCard(dropParent,dropIndex))){
            splice = cardsInWaste.splice(dragIndex, cardsInWaste.length-dragIndex)
            cardsInFoundation[dropParent] = cardsInFoundation[dropParent].concat(splice)
            renderBoard();
        }
//foundation to tableau
    } else if (dragParent.includes('foundation') && dropParent.includes('tableau') && cardsInTableau[dropParent].length > 0) {
        const dropIndex = cardsInTableau[dropParent].findIndex(card => card.class === ev.target.classList[1])
        if (checkLegalTableau(returnCard(dragParent,dragIndex),returnCard(dropParent,dropIndex))){
            splice = cardsInFoundation[dragParent].splice(dragIndex, cardsInFoundation[dragParent].length-dragIndex)
            cardsInTableau[dropParent] = cardsInTableau[dropParent].concat(splice)
            renderBoard();
        }
//waste to tableau without cards
    } else if (dragParent.includes('waste') && dropParent.includes('tableau') && (cardsInWaste.length-dragIndex) === 1 && cardsInTableau[dropParent].length === 0) {
        if (checkLegalTableauInit(returnCard(dragParent,dragIndex))){
            splice = cardsInWaste.splice(dragIndex, cardsInWaste.length-dragIndex)
            cardsInTableau[dropParent] = cardsInTableau[dropParent].concat(splice)
            renderBoard();
        }        
//tableau to tableau without cards
    } else if (dragParent.includes('tableau') && dropParent.includes('tableau') && cardsInTableau[dropParent].length === 0) {
        if (checkLegalTableauInit(returnCard(dragParent,dragIndex))){
            splice = cardsInTableau[dragParent].splice(dragIndex, cardsInTableau[dragParent].length-dragIndex)
            cardsInTableau[dropParent] = cardsInTableau[dropParent].concat(splice)
            renderBoard();
        }
        
    }   
}



function returnCard(parent, index){
    if (parent.includes('tableau')) {
        return cardsInTableau[parent][index]
    } else if (parent.includes('foundation')) {
        return cardsInFoundation[parent][index]
    } else if (parent.includes('waste')) {
        return cardsInWaste[index]
    }
    
}

//Legal Moves functions

function checkLegalTableau(card1, card2) {
    return (card2.rank-1 === card1.rank && card2.isRed != card1.isRed)
}

function checkLegalFoundationInit(card1) {
    return (card1.rank === 1)
}

function checkLegalFoundation(card1, card2) {
    return (card2.rank+1 === card1.rank && card2.suit === card1.suit)
}

function checkLegalTableauInit(card1) {
    return (card1.rank === 13)
}

function winCondition() {
    if (Object.values(cardsInFoundation).every(f => f.length === 13)) {
        document.querySelector('.win').style.opacity = '1'
    }
}

function winGame() {
    deck = []
    cardsInWaste = [];
    generateDeck();
    cardsInFoundation = {
        foundation1:[],
        foundation2:[],
        foundation3:[],
        foundation4:[]
    }
    cardsInTableau = {
        tableau1:[],
        tableau2:[],
        tableau3:[],
        tableau4:[],
        tableau5:[],
        tableau6:[],
        tableau7:[]
    }
    for (found in cardsInFoundation) {cardsInFoundation[found] = deck.splice(0,13)}
    renderBoard()



}

//Theme Functions

function changeTheme(value) {
  
    let sheetsEl = document
        .getElementsByTagName('link');

    sheetsEl[1].href = `css/cardstarter-${value}.css`;

    document.querySelector('body').style.backgroundImage = `url("./images/backgrounds/${value}.jpeg")`

}

init()