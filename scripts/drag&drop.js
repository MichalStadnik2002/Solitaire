let initialPile, target;
let buffer = [];
  
  //code bellow is based on code from https://stackoverflow.com/a/63425707/19125705
  //original comments was delated for code clarity
function filter(e) {
  target = e.target.parentNode;
  initialPile = target.parentNode;
    
    if ((target.parentNode.id == 'reversed_cards')) {
      reverseRemainingCard(target);
    } else if (e.target.id == 'reversed_cards') {
      reverseAllCards();
    } else if (target.tagName == 'CARD-T' && target.rank != 0) {
      const cardsAbove = areCardsAbove(target);
      if (cardsAbove) {
        target = moveFewCards(target, cardsAbove);
      }

      firstTop = target.style.top;
      target.moving = true;
      target.classList.add("card-is-moving");
    

      if (e.clientX) {
        target.oldX = e.clientX;
        target.oldY = e.clientY;
      } else {
        target.oldX = e.touches[0].clientX;
        target.oldY = e.touches[0].clientY;
      }

      target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
      target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

      document.onmousemove = dr;
      document.ontouchmove = dr;

      function dr(event) {
        event.preventDefault();

        if (!target.moving) {
          return;
        }
        if (event.clientX) {
          target.distX = event.clientX - target.oldX;
          target.distY = event.clientY - target.oldY;
        } else {
          target.distX = event.touches[0].clientX - target.oldX;
          target.distY = event.touches[0].clientY - target.oldY;
        }

        target.style.left = target.oldLeft + target.distX + "px";
        target.style.top = target.oldTop + target.distY + "px";
      }

    } else {
      return;
    }
}
  
document.onmousedown = filter;
document.ontouchstart = filter;
//consistently, here should be added event listener for touch up
document.addEventListener('mouseup', (e) => {
  const elementsBellow = whatIsBellow();
  let movingElement = document.querySelector('.card-is-moving');
  let movingDiv, movingCard;

  if (movingElement.tagName === 'DIV') {
    movingDiv = movingElement;
    movingCard = movingElement.childNodes[0];
  } else if (movingElement.tagName === 'CARD-T') {
    movingCard = movingElement
  }

  if (movingCard) {
    movingElement.classList.remove('card-is-moving');
    if (isCardBellowGood(elementsBellow, movingCard)) {
      if (elementsBellow[2]) { //temporary until function isCardBellowGood not exsist
        if (movingDiv) {
          putFewCards(movingDiv, elementsBellow[2]);
        } else {
          
          putCardOnThePile(movingCard, initialPile, elementsBellow[2]);
        }
      }
    }
    else {
      movingElement.style.left = 0;
      movingElement.style.top = firstTop;
    }
    movingElement.moving = false;
  }
})

function whatIsBellow() {
  let targetDiv = document.querySelectorAll(":hover");
  targetDiv = Array.from(targetDiv);
  targetDiv.splice(0, 4);
  return targetDiv;
}
  
const reversedCards = document.getElementById("reversed_cards");
const unreversedCards = document.getElementById("unreversed_cards");

function reverseRemainingCard(reversedCard) {
  reverseCard(reversedCard, true);
  
  arrangedCards[7].push(arrangedCards[8].pop());
  
  reversedCards.removeChild(reversedCard);
  unreversedCards.appendChild(reversedCard);
}

function reverseAllCards() {
  const children = unreversedCards.children;
  for (let i = children.length - 1, j = 0; i >= 0; i--, j++) {
    arrangedCards[8].push(arrangedCards[7].pop());
    reverseCard(children[i], true)
    reversedCards.appendChild(children[i]);
  }
}

function isCardBellowGood(elementsBellow, movingCard) { return true; };

function moveFewCards(handledCard, cardsAbove) {
  const movingCards = document.createElement('div');
  movingCards.classList.add('buffer');
  handledCard.parentNode.append(movingCards);
  while (cardsAbove.length) {
    movingCards.append(cardsAbove.shift());
  }
  return movingCards;
}

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

function putFewCards(divWithCards, targetPile) {
    if (targetPile.classList[0] === 'pile') {
      let children = Array.from(divWithCards.children);
      while (children.length) {
        putCardOnThePile(children.shift(), divWithCards, targetPile);
      };
      divWithCards.remove();
      if (!Number(initialPile.lastChild.rank)) {
        reverseCard(initialPile.lastChild, false);
      }
    }  
}

function putCardOnThePile(card, initialPile, targetPile) {
  const movingCardObject = cardToObject(card);
  const targetArray = pileToSubarray(targetPile);
  const initialArray = pileToSubarray(initialPile);

  initialArray.splice(initialArray.indexOf(movingCardObject), 1);
  targetArray.push(movingCardObject);

  targetPile.append(card);
  card.style.left = 0;
  card.style.top = `${1.2 * (targetPile.children.length - 1)}vw`;

  if (initialPile.lastChild){
    reverseCard(initialPile.lastChild, false);
  }

}