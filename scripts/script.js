const button = document.getElementById("start_button");

function slideUp(elementId, time)
{
    const element = document.getElementById(elementId);

    element.style.transform = "translateY(-100vh)";
    element.style.transition = "all " + time + "s ease-in-out";

    setTimeout(() => { element.style.display = "none"; }, time * 1000);
}

function slideInitialPage()
{
    slideUp("start_button", 1);
    slideUp("initial_header", 1);
    slideUp("initial_page", 1);
}

button.addEventListener("click", slideInitialPage);