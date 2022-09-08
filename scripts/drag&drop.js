'use strict';

/* ---------- Global variables ------------- */

let initialPile, target, firstTop;
let buffer = [];

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
    if ((target.parentNode.id == 'reversed_cards')) {
      reverseRemainingCard(target);
    } else if (e.target.id == 'reversed_cards') {
      reverseAllCards();
    } else if (target.tagName == 'CARD-T' && target.rank != 0) {
      const cardsAbove = areCardsAbove(target);
      if (cardsAbove) {
        target = moveFewCards(target, cardsAbove);
      }
      
      moveCard(e, target);
      
    } else {
      return;
    }
  }
  catch {
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
  
  card.oldLeft = window.getComputedStyle(card).getPropertyValue('left').split('px')[0] * 1;
  card.oldTop = window.getComputedStyle(card).getPropertyValue('top').split('px')[0] * 1;
  
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
  const movingCards = document.createElement('div');
  movingCards.classList.add('buffer');
  handledCard.parentNode.append(movingCards);
  while (cardsAbove.length) {
    movingCards.append(cardsAbove.shift());
  }
  return movingCards;
}

function putCard(e) {
  let movingElement = document.querySelector('.card-is-moving');
  let movingDiv, movingCard;
  if (movingElement) {
    const elementsBellow = whatIsBellow();
    
    if (movingElement.tagName === 'DIV') {
      movingDiv = movingElement;
      movingCard = movingElement.childNodes[0];
    } else if (movingElement.tagName === 'CARD-T') {
      movingCard = movingElement
    }
    
    movingElement.classList.remove('card-is-moving');
    movingElement.moving = false;
    if (elementsBellow[2] && isCardBellowGood(elementsBellow, movingCard)) {
      if (movingDiv) {
        putFewCards(movingDiv, elementsBellow[2]);
      } else {
        putCardOnThePile(movingCard, initialPile, elementsBellow[2]);
      }
    } else {
      movingElement.style.left = 0;
      movingElement.style.top = firstTop;
    }
  }
}

function putCardOnThePile(card, initialPile, targetPile) {
  const movingCardObject = cardToObject(card);
  const targetArray = pileToSubarray(targetPile);
  const initialArray = pileToSubarray(initialPile);
  let shift;
  
  initialArray.splice(initialArray.indexOf(movingCardObject), 1);
  targetArray.push(movingCardObject);
  
  targetPile.append(card);
  card.style.left = 0;
  if (card.previousElementSibling && !targetPile.classList.contains('final_area')) {
    shift = `${Number(card.previousElementSibling.style.top.replace('vw', '')) + 1.5}vw`;
    shift === 'NaNvw' ? card.style.top = '1.5vw' : card.style.top = shift;
  }
  else {
    card.style.top = 0;
  }
  
  if (initialPile.lastChild){
    reverseCard(initialPile.lastChild, false);
  }
}

function putFewCards(divWithCards, targetPile) {
  if (targetPile.classList[0] === 'pile') {
    let children = Array.from(divWithCards.children);
    while (children.length) {
      putCardOnThePile(children.shift(), divWithCards, targetPile);
    };
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
    buffer = parentArray.splice(parentArray.indexOf(checkedCardObject))
    return cardsAbove;
  } else {
    return undefined;
  }
}


function whatIsBellow() {
    let targetDiv = document.querySelectorAll(":hover");
    targetDiv = Array.from(targetDiv);
    targetDiv.splice(0, 4);
  return targetDiv;
}

function reverseRemainingCard(reversedCard) {
  reverseCard(reversedCard, true);
  
  arrangedCards[7].push(arrangedCards[8].pop());
  
  reversedCards.removeChild(reversedCard);
  unreversedCards.appendChild(reversedCard);
}

function reverseAllCards() {
  const children = unreversedCards.children;
  for (let i = children.length - 1; i >= 0; i--) {
    arrangedCards[8].push(arrangedCards[7].pop());
    reverseCard(children[i], true)
    reversedCards.appendChild(children[i]);
  }
}

function isCardBellowGood(elementsBellow, movingCard) {
  const movingCardObject = cardToObject(movingCard)
  let rankOfMovingCard = Number(movingCardObject.rank);
  const suitOfMovingCard = Number(movingCardObject.suit);
  const targetPile = elementsBellow[2];
  let targetCard = elementsBellow[3];
  let higherRankCondition, lowerRankCondition, opositeSuitCondition, sameSuitCondition;
  
  if (targetCard) {
    targetCard = cardToObject(targetCard)
    higherRankCondition = Number(targetCard.rank) === rankOfMovingCard + 1;
    lowerRankCondition = Number(targetCard.rank) === rankOfMovingCard - 1;
    opositeSuitCondition = Number(Boolean(suitOfMovingCard % 3)) === Number(!Boolean(Number(targetCard.suit) % 3));
    sameSuitCondition = Number(targetCard.suit) === suitOfMovingCard;
  }
  
  const isTargetFinalArea = targetPile.classList.contains("final_area");
  const isTargetPile = targetPile.classList.contains('pile')

  if (rankOfMovingCard >= 2 && rankOfMovingCard <= 12) {
    rankOfMovingCard = "other card";
  }

  switch (rankOfMovingCard) {
    case 1: //Ase
      return isTargetFinalArea ? true : false;
    case 13: //King
      if (isTargetPile && !targetPile.childNodes.length) {
        return true;
      }
      else if (isTargetFinalArea) {
        return lowerRankCondition && sameSuitCondition ? true : false; 
      }
      else {
        return false;
      }
    case 'other card':
      rankOfMovingCard = Number(movingCard.rank);
      if (isTargetPile && targetPile.childNodes.length) {
        return higherRankCondition && opositeSuitCondition ? true : false;
      } else if (isTargetFinalArea && targetPile.childNodes.length) {
        return lowerRankCondition && sameSuitCondition ? true : false
      } else {
        return false;
      }
    default:
      break;
  }
 };
