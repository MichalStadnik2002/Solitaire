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

//Generate 52-card deck

const Card = function (numberToRank, numberToSuit) {
    this.rank = numberToRank;
    this.suit = numberToSuit;
    this.isOnView = false;
    this.isOnPile = false;
}

let unshuffledCards = [];

for (let i = 1; i <= 13; i++)
{
    for (let j = 0; j < 4; j++)
    {
        unshuffledCards.push(new Card(i, j));
    }
}

console.log(unshuffledCards);