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