"use strict";

/* ---------- Global variables ------------- */

let initialPile, target, firstTop;
let buffer = [];
let moves = 0, points = 0;

/* ----- Moving cards section ----- */

document.onmousedown = pickUpCard;
document.ontouchstart = pickUpCard;
document.onmouseup = putCard;
document.ontouchend = putCard;

//code bellow is based on code from https://stackoverflow.com/a/63425707/19125705
//original comments was delated for code clarity
function pickUpCard(e) {
  target = e.target.parentNode;
  initialPile = target.parentNode;

  try {
    if (target.parentNode.id == "reversed_cards") {
      reverseRemainingCard(target);
      addPoints('reverse card')
    } else if (e.target.id == "reversed_cards") {
      reverseAllCards();
    } else if (target.tagName == "CARD-T" && target.rank != 0) {
      const cardsAbove = areCardsAbove(target);
      if (cardsAbove) {
        target = moveFewCards(target, cardsAbove);
      }

      moveCard(e, target);
    } else {
      return;
    }
  } catch {
    return undefined;
  }
}

function moveCard(e, card) {
  firstTop = card.style.top;
  card.moving = true;
  card.classList.add("card-is-moving");

  if (e.clientX) {
    card.oldX = e.clientX;
    card.oldY = e.clientY;
  } else {
    card.oldX = e.touches[0].clientX;
    card.oldY = e.touches[0].clientY;
  }

  card.oldLeft =
    window.getComputedStyle(card).getPropertyValue("left").split("px")[0] * 1;
  card.oldTop =
    window.getComputedStyle(card).getPropertyValue("top").split("px")[0] * 1;

  document.onmousemove = move;
  document.ontouchmove = move;

  function move(event) {
    event.preventDefault();

    if (!card.moving) {
      return;
    }
    if (event.clientX) {
      card.distX = event.clientX - card.oldX;
      card.distY = event.clientY - card.oldY;
    } else {
      card.distX = event.touches[0].clientX - card.oldX;
      card.distY = event.touches[0].clientY - card.oldY;
    }

    card.style.left = card.oldLeft + card.distX + "px";
    card.style.top = card.oldTop + card.distY + "px";
  }
}

function moveFewCards(handledCard, cardsAbove) {
  const movingCards = document.createElement("div");
  movingCards.classList.add("buffer");
  handledCard.parentNode.append(movingCards);
  while (cardsAbove.length) {
    movingCards.append(cardsAbove.shift());
  }
  return movingCards;
}

function putCard(e) {
  let movingDiv, movingCard, cardBellow, pileBellow;
  const movingElement = document.querySelector(".card-is-moving");
  if (!movingElement) return;

  if (e.target.parentNode.tagName === "CARD-T") {
    cardBellow = e.target.parentNode;
    pileBellow = cardBellow.parentNode;
  } else if (
    e.target.tagName === "DIV" &&
    e.target.classList.contains("card_area")
  ) {
    pileBellow = e.target;
  }

  if (movingElement.tagName === "DIV") {
    movingDiv = movingElement;
    movingCard = movingElement.childNodes[0];
  } else if (movingElement.tagName === "CARD-T") {
    movingCard = movingElement;
  }

  movingElement.classList.remove("card-is-moving");
  movingElement.moving = false;
  if (pileBellow && isCardBellowGood(pileBellow, cardBellow, movingCard)) {
    if (movingDiv) {
      putFewCards(movingDiv, pileBellow);
      whatAddPoints(movingCard, pileBellow, true)
    } else {
      putCardOnThePile(movingCard, initialPile, pileBellow);
      whatAddPoints(movingCard, pileBellow);
    }
    addMove();
  } else {
    movingElement.style.left = 0;
    movingElement.style.top = firstTop;
    putFewCards(movingElement, movingElement.parentNode); //remove temporary buffer div from initial pile
  }
}

function putCardOnThePile(card, initialPile, targetPile) {
  if (card.classList.contains("buffer")) return;
  let shift;

  moveObjectCardBetweenPiles(card, initialPile, targetPile);

  targetPile.append(card);
  card.style.left = 0;
  const previousElement =
    card.previousElementSibling &&
    card.previousElementSibling.classList.contains("buffer")
      ? card.previousElementSibling.previousElementSibling
      : card.previousElementSibling;
  if (previousElement && !targetPile.classList.contains("final_area")) {
    shift = `${Number(previousElement.style.top.replace("vw", "")) + 1.5}vw`;
    shift === "NaNvw" ? (card.style.top = "1.5vw") : (card.style.top = shift);
  } else {
    card.style.top = 0;
  }

  if (initialPile.lastChild) {
    reverseCard(initialPile.lastChild, false);
  }
}

function putFewCards(divWithCards, targetPile) {
  if (targetPile.classList[0] === "pile") {
    let children = Array.from(divWithCards.children);
    while (children.length) {
      putCardOnThePile(children.shift(), divWithCards, targetPile);
      // debugger
      addPoints('move few cards')
    }
    console.log("usuwam");
    divWithCards.remove();
    if (initialPile.childNodes.length && !Number(initialPile.lastChild.rank)) {
      reverseCard(initialPile.lastChild, false);
    }
  }
}

/* ---------- Checking functions --------------- */

function areCardsAbove(checkedCard) {
  let cardsAbove = [];
  let parentArray = pileToSubarray(checkedCard.parentNode);
  let checkedCardObject = cardToObject(checkedCard);
  let currentElement = checkedCard;
  while (currentElement) {
    cardsAbove.push(currentElement);
    currentElement = currentElement.nextElementSibling;
  }
  if (cardsAbove.length > 1) {
    buffer = parentArray.splice(parentArray.indexOf(checkedCardObject));
    return cardsAbove;
  } else {
    return undefined;
  }
}

function isCardBellowGood(targetPile, targetCard, movingCard) {
  const movingCardObject = cardToObject(movingCard);
  let rankOfMovingCard = Number(movingCardObject.rank);
  const suitOfMovingCard = Number(movingCardObject.suit);
  let higherRankCondition,
    lowerRankCondition,
    opositeSuitCondition,
    sameSuitCondition;

  if (targetCard) {
    targetCard = cardToObject(targetCard);
    higherRankCondition = Number(targetCard.rank) === rankOfMovingCard + 1;
    lowerRankCondition = Number(targetCard.rank) === rankOfMovingCard - 1;
    opositeSuitCondition =
      Number(Boolean(suitOfMovingCard % 3)) ===
      Number(!Boolean(Number(targetCard.suit) % 3));
    sameSuitCondition = Number(targetCard.suit) === suitOfMovingCard;
  }

  const isTargetFinalArea = targetPile.classList.contains("final_area");
  const isTargetPile = targetPile.classList.contains("pile");

  if (rankOfMovingCard >= 2 && rankOfMovingCard <= 12) {
    rankOfMovingCard = "other card";
  }

  switch (rankOfMovingCard) {
    case 1: //Ase
      return isTargetFinalArea ? true : false;
    case 13: //King
      if (isTargetPile && !targetPile.childNodes.length) {
        return true;
      } else if (isTargetFinalArea) {
        return lowerRankCondition && sameSuitCondition ? true : false;
      } else {
        return false;
      }
    case "other card":
      rankOfMovingCard = Number(movingCard.rank);
      if (isTargetPile && targetPile.childNodes.length) {
        return higherRankCondition && opositeSuitCondition ? true : false;
      } else if (isTargetFinalArea && targetPile.childNodes.length) {
        return lowerRankCondition && sameSuitCondition ? true : false;
      } else {
        return false;
      }
    default:
      break;
  }
}
