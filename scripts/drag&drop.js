  //code bellow is based on code from https://stackoverflow.com/a/63425707/19125705
  //original comments was delated for code clarity
  function filter(e) {
    let target = e.target.parentNode;

    if (!(target.parentNode.id == 'reversed_cards')) {
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

    }
    else {
      //code here will reverse cards and move to unreversed cards pile
    }
}
  
document.onmousedown = filter;
document.ontouchstart = filter;
//consistently, here should be added event listener for touch up
document.addEventListener('mouseup', () => {
  const cardBellow = whatIsBellow();
  const movingElement = document.querySelector('.card-is-moving');
  movingElement.classList.remove('card-is-moving');
  movingElement.style.left = 0;
  movingElement.style.top = firstTop;
  movingElement.moving = false;
  console.log(cardBellow);
})

function whatIsBellow() {
    const targetDiv = document.querySelectorAll(":hover");
    return targetDiv;
  }
