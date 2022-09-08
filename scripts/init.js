"use strict";

/* -------------------- All DOM Handles ----------------------------------- */

const reversedCards = document.getElementById("reversed_cards");
const unreversedCards = document.getElementById("unreversed_cards");
const button = document.getElementById("start_button");
const initial_page = document.getElementById("initial_page");

/* -------------------- Slide up Initial Page ----------------------------------- */

function slideUp(element, time) {
  // const element = document.getElementById(elementId);

  element.style.transform = "translateY(-100vh)";
  element.style.transition = "all " + time + "s ease-in-out";

  setTimeout(() => {
    element.style.display = "none";
  }, time * 1000);
}

function slideInitialPage() {
  const initial_elements = initial_page.children;

  Array.from(initial_elements).forEach((element) => {
    slideUp(element, 2);
  });

  slideUp(initial_page, 2);
}

button.addEventListener("click", slideInitialPage);

/* --------------------Card generate section ----------------------------------- */

//Card object

const Card = function (numberToRank, numberToSuit) {
  this.rank = numberToRank;
  this.suit = numberToSuit;
  this.isOnView = false;
  this.indexInPile = 0; //Cards with index = 0, are on pile bottom
  this.pileIndex = 8; //value between 0 to 6 - means pile from 1 to 7, 7 mean unreversed remaing pile, 8 mean reversed remaining pile, 9-12 mean final area from 1 to 4

  this.genereteCardElement = function (parentElement, isReversed = true) {
    //reversed means rank and suit card are unvisible, unreversed has oposite meaning
    const newCard = document.createElement("card-t");
    const shift = this.indexInPile;

    newCard.style.position = "absolute";
    newCard.style.top = `${1 * shift}vw`;
    newCard.setAttribute("rank", "0");
    newCard.setAttribute("suit", "0");

    if (this.pileIndex === 8) {
      newCard.style.top = "0vw";
    } else if (!isReversed) {
      newCard.setAttribute("rank", this.rank);
      newCard.setAttribute("suit", this.suit);
      this.isOnView = true;
    }

    parentElement.append(newCard);
  };

  this.objectToCard = function () {
    let cardT;

    function getCardT(parentId) {
      const parent = document.getElementById(parentId);
      const children = parent.childNodes;
      cardT = children[children.length - 1 - this.indexInPile];
    }

    if (this.pileIndex >= 0 && this.pileIndex < 7) {
      const parentId = "pile_" + (this.pileIndex + 1);
      getCardT(parentId);
    } else if (this.pileIndex === 7) {
      getCardT("unreversed_cards");
    } else if (this.pileIndex === 8) {
      getCardT("reversed_cards");
    } else if (this.pileIndex > 8 && this.pileIndex < 13) {
      const parentId = "final_area_" + (this.pileIndex + 1);
      getCardT(parentId);
    } else {
      return undefined;
    }

    return cardT;
  };
};

let arrangedCards = Array.from(Array(13), () => new Array(0));
//Arrays from arrangedCards[0] to [6] - piles with id pile_1 to pile_7
//arrangedCards[7] - unreversed cards
//arrangedCards[8] - reversed cards
//Arrays from arrangedCards[9] to [12] - final areas with id final_area_1 to final_area_4

getArrangedCards();

function getArrangedCards() {
  let deck = [];
  let shuffledCards = [];
  deckGenerator(deck);
  deckShuffler(deck, shuffledCards);
  shuffledCards = shuffledCards.flat();
  arrangeCards(arrangedCards, shuffledCards);
}

//Generate 52-card deck

function deckGenerator(arrayForDeck) {
  for (let i = 1; i <= 13; i++) {
    for (let j = 0; j < 4; j++) {
      arrayForDeck.push(new Card(i, j));
    }
  }
}

function deckShuffler(deckArray, shuffledCardsArray) {
  for (let i = deckArray.length; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * deckArray.length);
    shuffledCardsArray.push(deckArray.splice(randomIndex, 1));
  }
}

function arrangeCards(arrangedCardsArray, shuffledCardsArray) {
  for (let i = 6; i >= 0; i--) {
    const actualPile = document.getElementById(`pile_${i + 1}`);
    for (let j = 0; j <= i; j++) {
      const isLastCard = j === i ? true : false;
      // console.log(shuffledCardsArray)
      moveCardAndGenerateCardT(
        shuffledCardsArray,
        arrangedCardsArray[i],
        actualPile,
        i,
        j,
        !isLastCard
      );
    }
  }

  for (let i = shuffledCardsArray.length - 1; i >= 0; i--) {
    moveCardAndGenerateCardT(
      shuffledCardsArray,
      arrangedCardsArray[8],
      reversedCards,
      8,
      i,
      true
    );
  }
}

function moveCardAndGenerateCardT(
  startingArray,
  targetArray,
  targetPile,
  pileIndex,
  indexInPile,
  isReversedCard
) {
  const actualCard = startingArray.shift();
  targetArray.push(actualCard);
  actualCard.pileIndex = pileIndex;
  actualCard.indexInPile = indexInPile;
  actualCard.genereteCardElement(targetPile, isReversedCard);
}

/* -------------------- Card-T & piles functions ----------------------------------- */
//convert given card-t to object
function cardToObject(cardT) {
  if (cardT.tagName != "CARD-T") {
    return undefined;
  }

  const parent = cardT.parentNode;
  const subarray = pileToSubarray(parent);
  const parentIndex = getIndexInParentElement(cardT);

  return subarray[parentIndex];
}

//convert given pile div to responding subarray in arranged_card

function pileToSubarray(pile) {
  if (
    !(
      pile.tagName == "DIV" &&
      (pile.classList.contains("card_area") ||
        pile.classList.contains("buffer"))
    )
  ) {
    return undefined;
  }

  const pileClass = pile.classList.item(0);
  const pileId = pile.id;
  let subarray;

  function getSubarray(subarrayIndex) {
    subarray = arrangedCards[subarrayIndex];
  }

  switch (pileClass) {
    case "pile":
      const pileNumber = pileId.replace("pile_", "");
      getSubarray(pileNumber - 1);
      break;
    case "remaining_pile":
      switch (pileId) {
        case "unreversed_cards":
          getSubarray(7);
          break;
        case "reversed_cards":
          getSubarray(8);
          break;
        default:
          break;
      }
      break;
    case "final_area":
      const finalAreaNumber = parseInt(pileId.replace("final_area_", ""));
      getSubarray(finalAreaNumber + 8);
      break;
    case "buffer":
      subarray = buffer;
      break;
    default:
      break;
  }

  return subarray;
}

function reverseCard(cardT, reverseUnreversedCards = false) {
  if (cardT.tagName != "CARD-T") {
    return undefined;
  }

  const cardObject = cardToObject(cardT);

  if (cardT.rank == 0) {
    cardT.setAttribute("rank", cardObject.rank);
    cardT.setAttribute("suit", cardObject.suit);
  } else if (reverseUnreversedCards) {
    cardT.setAttribute("rank", "0");
  } else {
    return undefined;
  }
}

/* ----------------------- Other functions ---------------------------------------- */

function getIndexInParentElement(element) {
  const parentIndex = Array.prototype.indexOf.call(
    element.parentNode.childNodes,
    element
  );
  return parentIndex;
}
