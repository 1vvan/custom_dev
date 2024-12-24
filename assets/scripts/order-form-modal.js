import settings from '../settings.js';

document.addEventListener("DOMContentLoaded", function () {
    const validPromoCodes = settings.promocodes;
    const cardIcons = settings.icons;

    const modalForm = document.querySelector('.form_modal');
    const modalSuccess = document.getElementById('success_modal');
    const modalSuccessOrderNumber = document.getElementById('order_number');
    const closeFormModal = document.getElementById('modal-close-standart-design');
    const closeSuccessModal = document.getElementById('modal-close-success');
    const confirmSuccessBtn = document.getElementById('confirm_btn');
    const body = document.body; 


    // const form = document.getElementById("form_default_card");
    const submitButton = document.getElementById("sumbit_buy_default_card");
    const nameInput = document.getElementById("name_input");
    const phoneInput = document.getElementById("phone_input");
    const commentInput = document.getElementById("comment_input");
    const citySelect = document.getElementById("post_city");
    const postOfficeSelect = document.getElementById("post_office");
    const paymentType1 = document.getElementById("payment_type_1");

    const urgentCheckbox = document.getElementById("urgent_checkbox");
    const fileInput = document.getElementById("file_input");

    const promoCodeInput = document.getElementById("promo_code_input");
    const costTotalTitle = document.querySelector(".cost_val.total");
    const costTotal = document.getElementById("cost_val_total");

    let initialTotalCost = 1999;

    function checkModalHeight(modal) {
        const modalContent = modal.querySelector('.modal-content');
    
        if (modalContent) {
            const modalContentHeight = modalContent.offsetHeight;

            if (modalContentHeight > window.innerHeight) {
                modal.style.alignItems = 'start';
            }
        }
    }

    function applyDiscount(discount) {
        const discountAmount = initialTotalCost * discount;
        const discountedTotal = initialTotalCost - discountAmount;
    
        if (!document.getElementById('promo_code_discount_line')) {
            const discountLine = document.createElement('p');
            discountLine.id = 'promo_code_discount_line';
            discountLine.classList.add('cost_val');
            discountLine.innerHTML = `Промокод: <span>-${(discount * 100).toFixed(0)}%</span>`;
            const costBoxDiv = costTotalTitle.parentNode;
    
            costBoxDiv.insertBefore(discountLine, costTotalTitle);
        }
    
        costTotal.innerHTML = `${parseInt(discountedTotal)} грн`;
    }

    function removeDiscount() {
        const discountLine = document.getElementById('promo_code_discount_line');
        if (discountLine) {
            discountLine.remove();
        }
        costTotal.innerHTML = `${initialTotalCost} грн`;
    }

    function applyPromoCode() {
        const enteredCode = promoCodeInput.value.toUpperCase();
        const valid = /^[A-Za-z]+$/.test(enteredCode);
    
        if (!valid) {
            promoCodeInput.style.borderColor = 'red';
            return false;
        }
    
        const promo = validPromoCodes.find(p => p.code === enteredCode);
        if (promo) {
            const discount = promo.discount;
            applyDiscount(discount);
            promoCodeInput.style.borderColor = 'green';
        } else {
            promoCodeInput.style.borderColor = 'red';
            removeDiscount();
        }
    }
    

    function generateOrderNumber() {
        const randomNumber = Math.floor(10000 + Math.random() * 1000);
        return `NS ${randomNumber}`;
    }

    function updateTotalCost() {
        let baseCost = parseInt(modalForm.dataset.price);
        let urgentCost = 0;
    
        if (urgentCheckbox && urgentCheckbox.checked) {
            urgentCost = 1000;
            if (!document.getElementById('urgent_cost_line')) {
                const urgentLine = document.createElement('p');
                urgentLine.id = 'urgent_cost_line';
                urgentLine.classList.add('cost_val');
                urgentLine.innerHTML = `Терміново: <span>${formatCost(urgentCost)} грн</span>`;
    
                const costBoxDiv = costTotalTitle.parentNode;
                costBoxDiv.insertBefore(urgentLine, costTotalTitle);
            }
        } else {
            const urgentLine = document.getElementById('urgent_cost_line');
            if (urgentLine) {
                urgentLine.remove();
            }
        }
    
        const total = baseCost + urgentCost;
        costTotal.innerHTML = `${formatCost(total)} грн`;
        initialTotalCost = total;
    }
    
    function formatCost(cost) {
        return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    

    promoCodeInput && promoCodeInput.addEventListener('input', function () {
        if (promoCodeInput.value === "") {
            removeDiscount();
        } else {
            applyPromoCode();
        }
    });

    urgentCheckbox && urgentCheckbox.addEventListener('change', function () {
        updateTotalCost();

        if (promoCodeInput.value && validPromoCodes.includes(promoCodeInput.value.toUpperCase())) {
            applyDiscount();
        }
    });

    // Проверка на заполнение всех полей
    function validateForm() {
        let valid = true;
    
        // Проверка имени на длину
        if (nameInput.value.length < 3) {
            nameInput.style.borderColor = 'red';
            valid = false;
        } else {
            nameInput.style.borderColor = 'initial';
        }
    
        // const phoneValue = phoneInput.value;
        // const phonePattern = /^(\+380\d{9}|\d{10})$/;

        // if (!phonePattern.test(phoneValue)) {
        //     phoneInput.style.borderColor = 'red';
        //     valid = false;
        // } else {
        //     phoneInput.style.borderColor = 'initial';
        // }

        if (!phoneInput.value.length) {
            phoneInput.style.borderColor = 'red';
            valid = false;
        } else {
            phoneInput.style.borderColor = 'initial';
        }
    
        // Проверка выбора города и отделения
        [citySelect, postOfficeSelect].forEach(select => {
            if (select.value === '0') {
                select.style.borderColor = 'red';
                valid = false;
            } else {
                select.style.borderColor = 'initial';
            }
        });

        if (fileInput && fileInput.files.length === 0) {
            fileInput.style.borderColor = 'red';
            valid = false;
        } else if (fileInput) {
            fileInput.style.borderColor = 'initial';
        }
    
        return valid;
    }
    

    // Обработчик для кнопки "Підтвердити"
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const selectedCityLabel = citySelect.options[citySelect.selectedIndex].text;
        const selectedPostOfficeLabel = postOfficeSelect.options[postOfficeSelect.selectedIndex].text;

        const selectedColor = document.querySelector('input[name="color"]:checked') ? `Колір: ${document.querySelector('input[name="color"]:checked').value}` : '';

        const selectedLogoId = $('.grid-item.selected').data('icon-id');
        const selectedLogo = cardIcons.find(icon => icon.id === selectedLogoId);
        const selectedLogoText = selectedLogo ? `Логотип: ${selectedLogo.alt}` : '';
        console.log(selectedLogo)

        if (validateForm()) {
            const telegramToken = '7815840917:AAGTUQzdIxMcYt36WSh62T6g0zDpQ9SyZkY';
            const chatId = '-1002349648883';

            const urgentText = urgentCheckbox ? (urgentCheckbox.checked ? 'Терміново: Так' : 'Терміново: Ні') : '';
            const fileText = fileInput && fileInput.files.length > 0 ? `Файл: ${fileInput.files[0].name}` : '';
            const totalCost = initialTotalCost;

            const text = `Замовлення на дизайн:\n\nІм'я: ${nameInput.value}\nТелефон: ${phoneInput.value}\nКоментар: ${commentInput.value || '-'}\nМісто: ${selectedCityLabel}\nВідділення: ${selectedPostOfficeLabel.trim()}\n${urgentText}\n${fileText}\n${selectedColor}\n${selectedLogoText}\nВартість: ${totalCost}\n`;

            const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

            await fetch(url);

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('document', file);
    
                await fetch(`https://api.telegram.org/bot${telegramToken}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
            }

            if (selectedLogo && selectedLogo.src) {
                const logoResponse = await fetch(selectedLogo.src);
                const logoBlob = await logoResponse.blob();

                let fileName = selectedLogo.src.split('/').pop();
                
                if (!fileName.includes('.')) {
                    fileName += '.svg';
                }

                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('document', logoBlob, fileName);
        
                await fetch(`https://api.telegram.org/bot${telegramToken}/sendDocument`, {
                    method: 'POST',
                    body: formData
                });
            }

            if (paymentType1.checked) {
                modalForm.style.opacity = '0';
                modalForm.style.display = 'none';

                const orderNumber = generateOrderNumber();
                modalSuccessOrderNumber.textContent = orderNumber;

                setTimeout(() => {
                    checkModalHeight(modalSuccess);
                    modalSuccess.style.display = 'flex';
                    modalSuccess.style.opacity = '1';
                }, 500);
            } else {
                function pay(totalAmount, orderId, clientData) {
                    var wayforpay = new Wayforpay();
                    
                    wayforpay.run({
                        merchantAccount: "izipizi_world",
                        merchantDomainName: "www.izipizi.world",
                        authorizationType: "SimpleSignature",
                        merchantSignature: clientData.signature,
                        orderReference: orderId.replace(/\s+/g, ''),
                        orderDate: Math.floor(Date.now() / 1000),
                        amount: totalAmount,
                        currency: "UAH",
                        productName: "Дизайн картки",
                        productPrice: totalAmount,
                        productCount: "1",
                        clientFirstName: clientData.firstName,
                        clientLastName : " ", 			
                        clientPhone: clientData.phone,
                        language: "UA"
                    }, 
                    function() {
                        modalForm.style.opacity = '0';
                        modalForm.style.display = 'none';

                        modalSuccessOrderNumber.textContent = clientData.orderId;

                        setTimeout(() => {
                            checkModalHeight(modalSuccess);
                            modalSuccess.style.display = 'flex';
                            modalSuccess.style.opacity = '1';
                        }, 500);
                    }, 
                    function (response) {
                        console.log(response)
                    }, 	
                )}

                const orderId = generateOrderNumber();
                const totalAmount = initialTotalCost;
                
                const secretKey = '0a53de1f2f2a2c2d311b1e0be1497c471fc5fe89';
                const currentTimestamp = Math.floor(Date.now() / 1000);

                const signatureString = [
                    "izipizi_world",                // merchantAccount
                    "www.izipizi.world",            // merchantDomainName
                    orderId.replace(/\s+/g, ''),    // orderReference
                    currentTimestamp,               // orderDate
                    totalAmount,                    // amount
                    "UAH",                          // currency
                    "Дизайн картки",                // productName
                    "1",                            // productCount
                    totalAmount                     // productPrice
                ].join(';');
                
                const signature = CryptoJS.HmacMD5(signatureString, secretKey).toString();

                const clientData = {
                    firstName: nameInput.value,
                    phone: phoneInput.value,
                    signature: signature,
                    orderId: orderId
                };

                pay(totalAmount, orderId, clientData);
            }

        }
    });

    // Получение городов из API Новой Почты
    async function fetchCities() {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "apiKey": "1041daa085f040ef3d54500c61d882b6",
                "modelName": "Address",
                "calledMethod": "getCities",
                "methodProperties": {}
            })
        });

        const data = await response.json();
        populateCitySelect(data.data);
    }

    // Заполнение селекта городов
    function populateCitySelect(cities) {
        citySelect.innerHTML = '<option value="0" selected>Ваше місто</option>';
        postOfficeSelect.innerHTML = '<option value="0" selected>Номер відділення</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.Ref;
            option.textContent = city.Description;
            citySelect.appendChild(option);
        });
    }

    // Получение отделений для выбранного города
    async function fetchPostOffices(cityRef) {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "apiKey": "1041daa085f040ef3d54500c61d882b6",
                "modelName": "Address",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    "CityRef": cityRef
                }
            })
        });

        const data = await response.json();
        populatePostOfficeSelect(data.data);
    }

    // Заполнение селекта отделений
    function populatePostOfficeSelect(postOffices) {
        postOfficeSelect.innerHTML = '<option value="0" selected>Номер відділення</option>';
        postOffices.forEach(office => {
            const option = document.createElement('option');
            option.value = office.Ref;
            option.textContent = office.Description;
            postOfficeSelect.appendChild(option);
        });
    }

    // Событие для выбора города
    citySelect.addEventListener('change', function () {
        const cityRef = this.value;
        if (cityRef !== '0') {
            fetchPostOffices(cityRef);
        } else {
            postOfficeSelect.innerHTML = '<option value="0" selected>Номер відділення</option>';
        }
    });

    // Инициализация: загрузка городов
    fetchCities();

    const fileNameDisplay = document.getElementById('file_text');

    fileInput && fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Зображення';
        }
    });



    const orderButtonIndivIndex = document.getElementById("order_button_individual");
    
    if (orderButtonIndivIndex) {
        const modalIndiv = document.querySelector('#form_individual_modal');

        checkModalHeight(modalIndiv);

        orderButtonIndivIndex.addEventListener('click', function() {
            modalIndiv.style.display = 'flex';
            modalIndiv.style.opacity = '1';
            body.classList.add('no-scroll');
        });
    }

    const orderBtn = document.getElementById('order_btn');
        
    orderBtn && orderBtn.addEventListener('click', function() {
        checkModalHeight(modalForm);
        modalForm.style.display = 'flex';
        modalForm.style.opacity = '1';

        const url = new URL(window.location.href);
        const type = url.searchParams.get('type');
        if (type) {
            const price = type === 'nfc' ? 2799 : 1999;
            modalForm.querySelector('#cost_val_total').innerHTML = `${parseInt(price + 1999).toLocaleString('ru-RU')} грн`;
            modalForm.querySelector('#cost_val_price').innerHTML = `${parseInt(price).toLocaleString('ru-RU')} грн`;
            modalForm.dataset.price = price;
        }
        body.classList.add('no-scroll');
    });

    closeFormModal.addEventListener('click', function() {
        modalForm.style.opacity = '0';
        setTimeout(() => {
            modalForm.style.display = 'none';
            body.classList.remove('no-scroll');
        }, 700);

    });

    closeSuccessModal.addEventListener('click', function() {
        modalSuccess.style.opacity = '0';
        setTimeout(() => {
            modalSuccess.style.display = 'none';
            body.classList.remove('no-scroll');
        }, 700);
    });

    confirmSuccessBtn.addEventListener('click', function() {
        modalSuccess.style.opacity = '0';
        setTimeout(() => {
            modalSuccess.style.display = 'none';
            body.classList.remove('no-scroll');
        }, 700);
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalSuccess) {
            modalSuccess.style.opacity = '0';
            setTimeout(() => {
                modalSuccess.style.display = 'none';
                body.classList.remove('no-scroll');
            }, 700);
        }
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalForm) {
            modalForm.style.opacity = '0';
            setTimeout(() => {
                modalForm.style.display = 'none';
                body.classList.remove('no-scroll');
            }, 700);
        }
    });
});
