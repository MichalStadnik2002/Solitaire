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

//Shuffle a deck

let shuffledCards = [];

for (let i = 0; i < unshuffledCards.length; i++)
{
    let randomIndex = Math.floor(Math.random() * unshuffledCards.length);
    shuffledCards[i] = unshuffledCards[randomIndex];
}

console.log(JSON.parse(JSON.stringify(shuffledCards)));

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