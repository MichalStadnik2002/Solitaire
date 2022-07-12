// const item = document.querySelectorAll('card-t');
// const areas = document.querySelectorAll('.card_area');
// const playboard = document.getElementById('playboard');

// // playboard.addEventListener('dragstart', (e) => {
  
// //   const card = e.target;
  
// // })

// console.log(item)

// // cards.forEach(item => {
// //   item.addEventListener('dragstart', dragStart())
// //   item.addEventListener('dragend', dragEnd())
// // });
// item.forEach(function (item) {
//   item.addEventListener("dragstart", function () {
//     console.log("drag Start");
//   });
//   item.addEventListener("dragend", function () {
//     console.log("drag end");
//   });
//   item.addEventListener('dragOver', function (e) {
//     e.preventDefault();
//     console.log('drag over')
//   })
//   item.addEventListener('drop', function () {
//     console.log('drop')
//   })
// });

// areas.forEach(function (area) {
//   area.addEventListener("dragover", function (e) {
//     e.preventDefault();
//     console.log("drag over");
//   });
//   area.addEventListener("drop", function () {
//     console.log("drop");
//   });
// })

//code bellow is based on code from https://stackoverflow.com/a/63425707/19125705
//original comments was delated for code clarity
function filter(e) {
  let target = e.target.parentNode;
  // console.log(target.parentNode.id);
  // console.log(target.style.bottom);

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

    function endDrag(event) {
      target.classList.remove("card-is-moving");
      target.moving = false;
      target.style.left = 0;
      target.style.top = firstTop;

      // console.log(event.relatedTarget);
      //code here check if card drag on another card or card area
    }
    target.onmouseup = endDrag;
    target.ontouchend = endDrag;
  }
  else {
    //code here will reverse cards and move to unreversed cards pile
  }
}
document.onmousedown = filter;
document.ontouchstart = filter;

