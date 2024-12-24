document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('calc_price_service');
    const countInput = document.getElementById('calc_price_count');
    const servicePriceElem = document.getElementById('calc_res_service_price');
    const discountPriceElem = document.getElementById('calc_res_discount_price');
    const totalPriceElem = document.getElementById('calc_res_total_price');
    const submitBtn = document.getElementById('calc_submit_btn');
    const submitBtnMobile = document.getElementById('calc_submit_btn_mobile');

    const modalContact = document.getElementById('modal_contact');
    const contactBtn = document.getElementById('contact_btn');
    const closeContactModal = document.getElementById('modal_contact_close');
    const body = document.body;

    function checkModalHeight(modal) {
        const modalContent = modal.querySelector('.modal-content');
    
        if (modalContent) {
            const modalContentHeight = modalContent.offsetHeight;

            console.log(modalContentHeight, window.innerHeight)
            if (modalContentHeight > window.innerHeight) {
                modal.style.alignItems = 'start';
            }
        }
    }

    // Ограничение ввода только чисел в поле количества
    countInput.addEventListener('input', function() {
        const value = this.value.replace(/\D/g, '');
        this.value = value;
    });

    function calculateTotal() {
        const servicePrice = parseFloat(serviceSelect.value) || 0;
        const count = parseInt(countInput.value) || 0;

        if (servicePrice > 0 && count >= 10) {
            const totalServicePrice = servicePrice * count;
            const discount = totalServicePrice * 0.20;
            const totalPrice = totalServicePrice - discount;

            servicePriceElem.textContent = totalServicePrice.toLocaleString('uk-UA') + ' грн';
            discountPriceElem.textContent = discount.toLocaleString('uk-UA') + ' грн';
            totalPriceElem.textContent = totalPrice.toLocaleString('uk-UA') + ' грн';
        } else {
            servicePriceElem.textContent = '0 грн';
            discountPriceElem.textContent = '0 грн';
            totalPriceElem.textContent = '0 грн';
        }
    }

    submitBtn && submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculateTotal();
    });

    submitBtnMobile && submitBtnMobile.addEventListener('click', function(e) {
        e.preventDefault();
        calculateTotal();
    });

    // Валидация контактной формы
    const contactForm = document.getElementById('contact_form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name_input');
        const phone = document.getElementById('phone_input');

        if (name.value.length < 3) {
            name.style.borderColor = 'red';
            return;
        } else {
            name.style.borderColor = 'initial';
        }
    
        // const phoneValue = phone.value;
        // const phonePattern = /^(\+380\d{9}|\d{10})$/;

        // if (!phonePattern.test(phoneValue)) {
        //     phoneInput.style.borderColor = 'red';
        //     return;
        // } else {
        //     phoneInput.style.borderColor = 'initial';
        // }

        if (!phone.value.length) {
            phone.style.borderColor = 'red';
            return;
        } else {
            phone.style.borderColor = 'initial';
        }

        const telegramToken = '7815840917:AAGTUQzdIxMcYt36WSh62T6g0zDpQ9SyZkY';
        const chatId = '-1002349648883';
        const text = `Корпоративне замовлення:\n\nІм'я: ${name.value}\nТелефон: ${phone.value}\n`;

        const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

        fetch(url).then(() => {
            modalContact.style.opacity = '0';
            setTimeout(() => {
                modalContact.style.display = 'none';
                body.classList.remove('no-scroll');
            }, 700);
        });

    });

    contactBtn && contactBtn.addEventListener('click', function() {
        checkModalHeight(modalContact);
        modalContact.style.display = 'flex';
        modalContact.style.opacity = '1';
        body.classList.add('no-scroll');
    });

    closeContactModal.addEventListener('click', function() {
        modalContact.style.opacity = '0';
        setTimeout(() => {
            modalContact.style.display = 'none';
            body.classList.remove('no-scroll');
        }, 700);
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalContact) {
            modalContact.style.opacity = '0';
            setTimeout(() => {
                modalContact.style.display = 'none';
                body.classList.remove('no-scroll');
            }, 700);
        }
    });
});
