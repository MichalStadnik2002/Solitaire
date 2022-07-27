//Slide up Initial Page

const button = document.getElementById("start_button");

function slideUp(element, time)
{
    // const element = document.getElementById(elementId);

    element.style.transform = "translateY(-100vh)";
    element.style.transition = "all " + time + "s ease-in-out";

    setTimeout(() => { element.style.display = "none"; }, time * 1000);
}

function slideInitialPage()
{
    const initial_page = document.getElementById("initial_page");

    const initial_elements = initial_page.children;

    Array.from(initial_elements).forEach(element => {
        slideUp(element, 2);
    });
    
    slideUp(initial_page, 2);
}

button.addEventListener("click", slideInitialPage);

//Card object

const Card = function (numberToRank, numberToSuit) {
    this.rank = numberToRank;
    this.suit = numberToSuit;
    this.isOnView = false;
    this.isOnPile = false;
    this.isCardBellowReversed = true;
    this.indexInPile = 0; //Cards with index = 0, are on pile bottom, cards with index above or equal to 7 aren't on any pile

    this.genereteCardElement = function (parentElement, isReversed) { 
        const newCard = document.createElement("card-t");
        newCard.style.position = "relative";

        //Maybe card-t elements should have float property?
        //Then this if should be realy changed
        if (this.indexInPile >= 7) {
            newCard.setAttribute("rank", "0");
            newCard.style.bottom = `${10.82 * (this.indexInPile-7)}vw`;
            // console.log(newCard.style.bottom);
        }
        else {
            if (isReversed) {
                newCard.setAttribute("rank", "0");
                newCard.style.bottom = `${(10.45 - 1) * this.indexInPile}vw`;
            }
            else {
                newCard.setAttribute("rank", this.rank);
                newCard.setAttribute("suit", this.suit);
                newCard.style.bottom = `${(10.45 - 1.5) * this.indexInPile}vw`;
                if (this.isCardBellowReversed) {
                    newCard.style.bottom = `${(10.45 - 1) * this.indexInPile}vw`;
                }
            }
        }
        parentElement.append(newCard);
    };
}

//deck_generator
//Generate 52-card deck

let unshuffledCards = [];

for (let i = 1; i <= 13; i++)
{
    for (let j = 0; j < 4; j++)
    {
        unshuffledCards.push(new Card(i, j));
    }
}

console.log(JSON.parse(JSON.stringify(unshuffledCards)));

//deck_shuffling
//Shuffle a deck

let shuffledCards = [];
const LengthOfUnshufledCards = unshuffledCards.length

for (let i = 0; i < LengthOfUnshufledCards ; i++)
{
    let randomIndex = Math.floor(Math.random() * unshuffledCards.length);
    shuffledCards[i] = unshuffledCards.splice(randomIndex,1);
}
shuffledCards = shuffledCards.flat();

console.log(JSON.parse(JSON.stringify(shuffledCards)));
console.log(unshuffledCards);

//cards arranger
//Arrange cards in 7 starter piles and array of remaining cards (remaining cards = arrangedCard[7])

let arrangedCards = Array.from(Array(8), () => new Array(0));

for (i = 0; i < 7; i++)
{
    for (j = 0; j <= i; j++)
    {
        arrangedCards[i][j] = shuffledCards.pop();
        }
}

while (shuffledCards.length > 0) {
  arrangedCards[7].push(shuffledCards[0]);
  shuffledCards.shift();
}

console.log(arrangedCards);

// arrangedCards[0][0].genereteCardElement(document.getElementById("pile_1"),true);
// arrangedCards[1][1].indexInPile = 1;
// arrangedCards[1][1].genereteCardElement(document.getElementById("pile_1"),true);
// arrangedCards[2][1].indexInPile = 2;
// arrangedCards[2][1].genereteCardElement(document.getElementById("pile_1"));
// arrangedCards[3][1].indexInPile = 3;
// arrangedCards[3][1].isCardBellowReversed = false;
// arrangedCards[3][1].genereteCardElement(document.getElementById("pile_1"));

//cards revealer
//Show all cards on playboard

for (i = 0; i < (arrangedCards.length-1); i++){
    const actualPile = document.getElementById(`pile_${i + 1}`);
    for (j = 0; j < arrangedCards[i].length; j++){
        arrangedCards[i][j].indexInPile = j;
        let isLastCard = false;
        if (j == (arrangedCards[i].length - 1)) {
            isLastCard = true;
        }
        arrangedCards[i][j].genereteCardElement(actualPile, !isLastCard);
    }
}

const reversedRemainigCards = document.getElementById("reversed_cards");
const lastIndexArangedCards = arrangedCards.length - 1

for (i = 0; i < arrangedCards[lastIndexArangedCards].length; i++){
    const ActualCard = arrangedCards[lastIndexArangedCards][i];
    ActualCard.indexInPile = i+7;
    ActualCard.genereteCardElement(reversedRemainigCards, true);
}

//convert card-t to object

function cardToObject(cardT) {
    if (cardT.tagName != "CARD-T") {
        return undefined;
    }

    const parent = cardT.parentNode;
    const parentClass = parent.classList.item(0);
    const parentId = parent.id
    const parentIndex = Array.prototype.indexOf.call(
              cardT.parentNode.childNodes,
              cardT
            );
    let cardObject;

    function getCardObject(arrangedCardsIndex) {
        cardObject = arrangedCards[arrangedCardsIndex][parentIndex];
    }

    switch (parentClass) {
        case 'pile':
            const pileNumber = parentId.replace('pile_', '');
            getCardObject(pileNumber - 1);
            break;
        case 'remaining_pile':
            switch (parentId) {
                case "unreversed_cards":
                    getCardObject(7);
                    break;
                case "reversed_cards":
                    getCardObject(8);
                    break;
              default:
                break;
            }
        case 'final_area':
            const finalAreaNumber = parentId.replace('final_area_', '');
            getCardObject(finalAreaNumber + 8);
        default:
            break;
    }
    return cardObject;
}