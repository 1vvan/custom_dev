document.addEventListener("DOMContentLoaded", function () {
    function getIsMobile() {
        return window.matchMedia("(max-width: 992px)").matches;
    }

    const body = document.body; 
    
    // Video Player
    // const video = document.getElementById('design_video');
    // const playButton = document.querySelector('.play-button');
    // const pauseButton = document.querySelector('.pause-button');

    // function togglePlay() {
    //     if (video.paused) {
    //         video.play();
    //         playButton.style.display = 'none';
    //         pauseButton.style.display = 'block';
    //     } else {
    //         video.pause();
    //         playButton.style.display = 'block';
    //         pauseButton.style.display = 'none';
    //     }
    // }

    // playButton.addEventListener('click', togglePlay);
    // pauseButton.addEventListener('click', togglePlay);

    // video.addEventListener('play', () => {
    //     playButton.style.display = 'none';
    //     pauseButton.style.display = 'block';
    // });

    // video.addEventListener('pause', () => {
    //     playButton.style.display = 'block';
    //     pauseButton.style.display = 'none';
    // });

    // Text Of Order Button
    const orderButton = document.getElementById("order_button");
    const orderButtonIndiv = document.getElementById("order_button_individual");

    function redirectToDesignPage() {
        window.location.href = "/pages/design.html";
    }

    orderButton.addEventListener('click', redirectToDesignPage);

    if (getIsMobile()) {
        orderButton.innerHTML = 'Замовити';
        orderButtonIndiv.style.display = 'none';
        orderButton.removeEventListener('click', redirectToDesignPage);
    }
    
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('modal-close');
    
    const smallImages = document.querySelectorAll('.our-works__small-images img');
    const bigImages = document.querySelectorAll('.our-works__big-image img');

    smallImages.forEach(image => {
        image.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.style.scale = getIsMobile() ? 1.15 : 1.5;
            body.classList.add('no-scroll');
            modal.style.display = 'flex';
            modal.style.opacity = '1';
        });
    });

    bigImages.forEach(image => {
        image.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.style.scale = getIsMobile() ? 0.6 : 1;
            body.classList.add('no-scroll');
            modal.style.display = 'flex';
            modal.style.opacity = '1';
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.opacity = '0';
        body.classList.remove('no-scroll');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 700);
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 700);
        }
    });
});
