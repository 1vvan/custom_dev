document.addEventListener("DOMContentLoaded", function () {
    const modalSelectCard = document.getElementById('modal_select_card');
    const closeSelectCardModal = document.getElementById('modal_close_select_card');
    const openSelectCardModalBtns = document.querySelectorAll('.select_card_btn');
    const body = document.body; 
    
    const modalIndividualCard = document.getElementById('form_individual_modal');
    const openIndividualForm = document.getElementById('open_individual_form');

    function checkModalHeight(modal) {
        const modalContent = modal.querySelector('.modal-content');
    
        if (modalContent) {
            const modalContentHeight = modalContent.offsetHeight;

            if (modalContentHeight > window.innerHeight) {
                modal.style.alignItems = 'start';
            }
        }
    }

    function openModal(price = 1999, type = 'nfc') {
        modalSelectCard.style.display = 'flex';
        modalSelectCard.querySelector('.standart').href = `./pages/design.html?type=${type}`;

        checkModalHeight(modalSelectCard);

        setTimeout(() => {
            body.classList.add('no-scroll');
            modalSelectCard.style.opacity = '1';
            modalSelectCard.dataset.price = price;
        }, 100);
    }

    openSelectCardModalBtns.forEach(button => {
        button.addEventListener('click', function () {
            openModal(button.dataset.price, button.dataset.type || 'nfc');
        });
    });

    closeSelectCardModal.addEventListener('click', function() {
        modalSelectCard.style.opacity = '0';
        setTimeout(() => {
            modalSelectCard.style.display = 'none';
            body.classList.remove('no-scroll');
        }, 700);
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalSelectCard) {
            modalSelectCard.style.opacity = '0';
            setTimeout(() => {
                modalSelectCard.style.display = 'none';
                body.classList.remove('no-scroll');
            }, 700);
        }
    });


    openIndividualForm.addEventListener('click', function(e) {
        e.preventDefault();

        modalSelectCard.style.opacity = '0';
        modalSelectCard.style.display = 'none';

        setTimeout(() => {
            checkModalHeight(modalIndividualCard);

            modalIndividualCard.style.display = 'flex';
            modalIndividualCard.style.opacity = '1';
            modalIndividualCard.dataset.price = modalSelectCard.dataset.price;
            modalIndividualCard.querySelector('#cost_val_total').innerHTML = `${parseInt(modalSelectCard.dataset.price).toLocaleString('ru-RU')} грн`;
            modalIndividualCard.querySelector('#cost_val_price').innerHTML = `${parseInt(modalSelectCard.dataset.price).toLocaleString('ru-RU')} грн`;
        }, 200);
    });
});
