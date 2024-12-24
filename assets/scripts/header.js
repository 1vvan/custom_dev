const body = document.body; 

function getIsMobile() {
    return window.matchMedia("(max-width: 992px)").matches;
}

document.getElementById("burger").addEventListener("click", function() {
    document.querySelector("header").classList.toggle("open");
    body.classList.toggle('no-scroll');
});

const menuLinks = document.querySelectorAll('header .menu__link');
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (getIsMobile() && document.querySelector('header').classList.contains('open')) {
            document.querySelector('header').classList.remove('open');
            body.classList.remove('no-scroll');
        }
    });
});