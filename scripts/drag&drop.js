  //code bellow is based on code from https://stackoverflow.com/a/63425707/19125705
  //original comments was delated for code clarity
  function filter(e) {
    let target = e.target.parentNode;
    
    if ((target.parentNode.id == 'reversed_cards')) {
      reverseRemainingCard(target);
    } else if (e.target.id == 'reversed_cards') {
      reverseAllCards();
    } else if (target.tagName == 'CARD-T' && target.rank != 0){
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
  const movingCard = document.querySelector('.card-is-moving');
  if (movingCard) {
    const initialPile = movingCard.parentNode;
    movingCard.classList.remove('card-is-moving');
    if (isCardBellowGood(elementsBellow, movingCard)) {
      if (elementsBellow[2]) { //temporary until function isCardBellowGood not exsist
        const movingCardObject = cardToObject(movingCard);
        const targetArray = pileToSubarray(elementsBellow[2])
        const initialArray = pileToSubarray(initialPile)

        initialArray.splice(initialArray.indexOf(movingCardObject), 1);
        targetArray.push(movingCardObject);

        elementsBellow[2].append(movingCard);
        movingCard.style.left = 0;
        movingCard.style.top = `${1.2 * (elementsBellow[2].children.length - 1)}vw`;

        if (initialPile.lastChild) {
          reverseCard(initialPile.lastChild);
        }
      }
    }
    else {
      movingCard.style.left = 0;
      movingCard.style.top = firstTop;
    }
    movingCard.moving = false;
  }
})

function whatIsBellow() {
  let targetDiv = document.querySelectorAll(":hover");
  targetDiv = Array.from(targetDiv);
  targetDiv.splice(0, 4);
  return targetDiv;
  }

function reverseRemainingCard(reversedCard) {
  const reversedCards = document.getElementById('reversed_cards');
  const cardObject = cardToObject(reversedCard);
  reversedCard.setAttribute('rank', cardObject.rank);
  reversedCard.setAttribute('suit', cardObject.suit);
  
  arrangedCards[7].push(arrangedCards[8].pop());
  
  const unreversedCards = document.getElementById('unreversed_cards');
  reversedCards.removeChild(reversedCard);
  unreversedCards.appendChild(reversedCard);
  reversedCard.style.bottom = `${10.82 * getIndexInParentElement(reversedCard)}vw`;
}

function reverseAllCards() {
  const reversedCards = document.getElementById("reversed_cards");
  const unreversedCards = document.getElementById("unreversed_cards");
  const children = unreversedCards.children;
  for (let i = children.length - 1, j = 0; i >= 0; i--, j++) {
    arrangedCards[8].push(arrangedCards[7].pop());
    children[i].setAttribute('rank', '0');
    children[i].style.bottom = `${10.82 * j}vw`;
    reversedCards.appendChild(children[i]);
  }
}

function isCardBellowGood(elementsBellow, movingCard) { return true; };