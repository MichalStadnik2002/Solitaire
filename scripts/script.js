const button = document.getElementById("start_button");

function slideUp(elementId, time)
{
    const element = document.getElementById(elementId);
    element.style.transition = "all 2s ease-in-out";
    element.style.height = "0px";
    setTimeout(() => {element.style.display = "none";},time)
}

function slideInitialPage()
{
    slideUp("start_button", 1000);
    slideUp("initial_header", 1000);
    slideUp("initial_page", 2000);
}

button.addEventListener("click", slideInitialPage);