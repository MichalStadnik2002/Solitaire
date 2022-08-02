//Slide up Initial Page

const button = document.getElementById("start_button");

function slideUp(element, time) {
  // const element = document.getElementById(elementId);

  element.style.transform = "translateY(-100vh)";
  element.style.transition = "all " + time + "s ease-in-out";

  setTimeout(() => {
    element.style.display = "none";
  }, time * 1000);
}

function slideInitialPage() {
  const initial_page = document.getElementById("initial_page");

  const initial_elements = initial_page.children;

  Array.from(initial_elements).forEach((element) => {
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
  this.indexInPile = 0; //Cards with index = 0, are on pile bottom
  this.pileIndex = 8; //value between 0 to 6 - means pile from 1 to 7, 7 mean unreversed remaing pile, 8 mean reversed remaining pile, 9-12 mean final area from 1 to 4

  this.genereteCardElement = function (parentElement, isReversed) {
    const newCard = document.createElement("card-t");
    const shift = arrangedCards[this.pileIndex].length - 1 - this.indexInPile;
    newCard.style.position = "relative";
    newCard.setAttribute("rank", this.rank);
    newCard.setAttribute("suit", this.suit);

    //Maybe card-t elements should have float property?
    //Then this if should be realy changed
    if (this.pileIndex == 8) {
      newCard.setAttribute("rank", "0");
      newCard.style.bottom = `${10.82 * shift}vw`;
      // console.log(newCard.style.bottom);
    } else {
      if (isReversed) {
        newCard.setAttribute("rank", "0");
        newCard.style.bottom = `${(10.45 - 1) * shift}vw`;
      } else {
        newCard.setAttribute("rank", this.rank);
        newCard.setAttribute("suit", this.suit);
        newCard.style.bottom = `${(10.45 - 1.5) * shift}vw`;
        if (this.isCardBellowReversed) {
          newCard.style.bottom = `${(10.45 - 1) * shift}vw`;
        }
      }
    }
    parentElement.append(newCard);
  };
};

//deck_generator
//Generate 52-card deck

let unshuffledCards = [];

for (let i = 1; i <= 13; i++) {
  for (let j = 0; j < 4; j++) {
    unshuffledCards.push(new Card(i, j));
  }
}

// console.log(JSON.parse(JSON.stringify(unshuffledCards)));

//deck_shuffling
//Shuffle a deck

let shuffledCards = [];
const LengthOfUnshufledCards = unshuffledCards.length;

for (let i = 0; i < LengthOfUnshufledCards; i++) {
  let randomIndex = Math.floor(Math.random() * unshuffledCards.length);
  shuffledCards[i] = unshuffledCards.splice(randomIndex, 1);
}
shuffledCards = shuffledCards.flat();

// console.log(JSON.parse(JSON.stringify(shuffledCards)));
// console.log(unshuffledCards);

//cards arranger
//Arrange cards in 7 starter piles and array of remaining cards
//Arrays from arrangedCards[0] to [6] - piles with id pile_1 to pile_7
//arrangedCards[7] - unreversed cards
//arrangedCards[8] - reversed cards
//Arrays from arrangedCards[9] to [12] - final areas with id final_area_1 to final_area_4

let arrangedCards = Array.from(Array(13), () => new Array(0));

for (i = 6; i >= 0; i--) {
  const actualPile = document.getElementById(`pile_${i + 1}`);
  for (j = i; j >= 0; j--) {
    arrangedCards[i][j] = shuffledCards.pop();
    arrangedCards[i][j].pileIndex = i;
    arrangedCards[i][j].indexInPile = j;
    let isLastCard = false;
    if (!j) {
      isLastCard = true;
    }
    arrangedCards[i][j].genereteCardElement(actualPile, !isLastCard);
  }
}

while (shuffledCards.length > 0) {
  arrangedCards[8].push(shuffledCards[0]);
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


const reversedRemainigCards = document.getElementById("reversed_cards");

for (i = arrangedCards[8].length - 1; i >= 0; i--) {
  const ActualCard = arrangedCards[8][i];
  ActualCard.indexInPile = i;
  ActualCard.genereteCardElement(reversedRemainigCards, false);
}

//convert given card-t to object

function cardToObject(cardT) {
  if (cardT.tagName != "CARD-T") {
    return undefined;
  }

  const parent = cardT.parentNode;
  const parentClass = parent.classList.item(0);
  const parentId = parent.id;
  const parentIndex = Array.prototype.indexOf.call(
    cardT.parentNode.childNodes,
    cardT
  );
  let cardObject;

  function getCardObject(arrangedCardsIndex) {
    cardObject = arrangedCards[arrangedCardsIndex][parentIndex];
  }

  switch (parentClass) {
    case "pile":
      const pileNumber = parentId.replace("pile_", "");
      getCardObject(pileNumber - 1);
      break;
    case "remaining_pile":
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
      break;
    case "final_area":
      const finalAreaNumber = parentId.replace("final_area_", "");
      getCardObject(finalAreaNumber + 8);
    default:
      break;
  }
  return cardObject;
}

//convert given object to card-t

function objectToCard(cardObject) {
  if (!cardObject || !cardObject.hasOwnProperty("pileIndex")) {
    return undefined;
  }

  let cardT;

  function getCardT(parentId) {
    const parent = document.getElementById(parentId);
    const children = parent.childNodes;
    cardT = children[cardObject.indexInPile];
  }

  if (cardObject.pileIndex >= 0 && cardObject.pileIndex < 7) {
    const parentId = "pile_" + (cardObject.pileIndex + 1);
    getCardT(parentId);
  } else if (cardObject.pileIndex == 7) {
    getCardT("unreversed_cards");
  } else if (cardObject.pileIndex == 8) {
    getCardT("reversed_cards");
  } else if (cardObject.pileIndex > 8 && cardObject.pileIndex < 13) {
    const parentId = "final_area_" + (cardObject.pileIndex + 1);
    getCardT(parentId);
  } else {
    return undefined;
  }

  return cardT;
}

console.log(objectToCard(arrangedCards[8][0]));
