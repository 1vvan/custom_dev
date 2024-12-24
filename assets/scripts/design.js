import settings from '../settings.js';

document.addEventListener("DOMContentLoaded", function () {
    // Color Select
    const cardColors = settings.colors;
    const cardIcons = settings.icons;
    const categories = settings.categories;

    const colorRadioContainer = document.getElementById('color-radio-container');
    const colorOverlay = document.getElementById('color-overlay');

    cardColors.forEach((color, index) => {
        const colorRadioItem = document.createElement('div');
        colorRadioItem.classList.add('color-radio__item');

        const itemPreview = document.createElement('div');
        itemPreview.classList.add('item-preview');
        const previewDiv = document.createElement('div');
        previewDiv.style.backgroundColor = color;
        itemPreview.appendChild(previewDiv);
        colorRadioItem.appendChild(itemPreview);

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `card_color_${index + 1}`;
        input.name = 'color';
        input.value = color;
        input.checked = index === 0;
        input.classList.add('color-radio-input');

        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.classList.add('color-radio-label');

        colorRadioItem.appendChild(input);
        colorRadioItem.appendChild(label);
        colorRadioContainer.appendChild(colorRadioItem);

        colorRadioItem.addEventListener('click', () => {
            input.checked = true;
            colorOverlay.style.backgroundColor = color;
            console.log(`Выбран цвет: ${color}`);
        });
    });

    function initCardColor() {
        colorOverlay.style.backgroundColor = cardColors[0];
    }

    initCardColor();

    // Logos Category
    const sliderCategoriesContainer = $('#card_logo_category_slider');

    categories.forEach(category => {
        const categoryItem = $(`
            <div class="card_logo_category_slider_item" data-category-id="${category.id}">
                ${category.name}
            </div>
        `);
        sliderCategoriesContainer.append(categoryItem);
    });

    sliderCategoriesContainer.slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        prevArrow: $('.prev-category-arrow'),
        nextArrow: $('.next-category-arrow')
    });

    // Logos Slider with dynamic loading and delayed slide change
    const sliderContainer = $('#card_logo_slider');

    function populateLogos(icons) {
        sliderContainer.empty();
        
        const chunkSize = 6;
        for (let i = 0; i < icons.length; i += chunkSize) {
            const iconChunk = icons.slice(i, i + chunkSize);
        
            const slide = $('<div class="card_logo_slide"></div>');
            const slideGrid = $('<div class="slide-grid"></div>');
        
            iconChunk.forEach(icon => {
                const iconDiv = $(`
                    <div class="grid-item" id="slide-icon-${icon.id}" data-icon-id="${icon.id}" data-src="${icon.src}">
                        <div class="icon-placeholder loading-placeholder loader-card-logo" style="width: 32px; height: 32px;"></div>
                        <img src="" alt="${icon.alt}" data-icon-id="${icon.id}" class="lazy-icon" style="width: 46px; height: 46px; opacity: 0;" loading="lazy">
                    </div>
                `);
                slideGrid.append(iconDiv);
            });
        
            slide.append(slideGrid);
            sliderContainer.append(slide);
        }
        
        if (sliderContainer.hasClass('slick-initialized')) {
            sliderContainer.slick('unslick');
        }
        
        sliderContainer.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            prevArrow: $('.prev-arrow-logo'),
            nextArrow: $('.next-arrow-logo'),
            infinite: false
        });
        
        // Lazy loading of icons with delay before slide change
        const lazyIcons = document.querySelectorAll('.lazy-icon');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const iconId = img.dataset.iconId;
                    const iconSrc = cardIcons.find(icon => icon.id == iconId).src;
    
                    // Загрузка SVG и замена img на SVG
                    $.get(iconSrc, function (data) {
                        const svg = $(data).find('svg');
                        svg.find('style').remove();  // Удаляем стили внутри SVG
    
                        svg.attr({
                            fill: '#B7B8B9',
                            width: '46',
                            height: '46'
                        });
    
                        // Замена img на svg
                        const iconDiv = $(img).parent();
                        $(img).remove();  // Убираем тег img
                        iconDiv.find('.icon-placeholder').replaceWith(svg);  // Заменяем плейсхолдер на SVG
                        
                        observer.unobserve(img);  // Останавливаем наблюдение за загруженными элементами
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        lazyIcons.forEach(img => {
            observer.observe(img);
        });
        
        // Initial first logo handling
        const firstIconId = cardIcons[0].id;
        const firstIconSrc = cardIcons[0].src;
        
        $.get(firstIconSrc, function (data) {
            const cardSvg = $(data).find('svg');
            cardSvg.attr({
                fill: '#1D1E20',
            });
            $('.card-icon').html(cardSvg);
        });
        
        $.get(firstIconSrc, function (data) {
            const sliderSvg = $(data).find('svg');
            sliderSvg.attr({
                fill: '#DFFC00',
                width: '46',
                height: '46'
            });
        
            $(`#slide-icon-${firstIconId}`).addClass('selected');
            $(`#slide-icon-${firstIconId}`).html(sliderSvg);
            $(`#slide-icon-${firstIconId}`).css('border-color', '#DFFC00');
        });
    }
    

    populateLogos(cardIcons);

    // Hooking into beforeSlideChange event to delay sliding until logos are loaded
    sliderContainer.on('beforeChange', function(event, slick, currentSlide, nextSlide){
        const nextSlideElement = sliderContainer.find(`.slick-slide[data-slick-index="${nextSlide}"]`);
        const lazyIconsInNextSlide = nextSlideElement.find('.lazy-icon:not([src])');

        if (lazyIconsInNextSlide.length > 0) {
            event.preventDefault();
            lazyIconsInNextSlide.each(function(index, img){
                const iconId = $(img).data('icon-id');
                const iconSrc = cardIcons.find(icon => icon.id == iconId).src;
                $(img).attr('src', iconSrc);
            });

            setTimeout(() => {
                slick.slickGoTo(nextSlide);
            }, 500);
        }
    });

    // Обработка кликов на логотипы
    sliderContainer.on('click', '.grid-item', function () {
        const selectedIconId = $(this).data('icon-id');
        const selectedIconSrc = $(this).data('src');

        $('.grid-item svg').attr('fill', '#B7B8B9');
        $('.grid-item').css('border-color', '#B7B8B9');

        $('.grid-item').removeClass('selected');

        $(`#slide-icon-${selectedIconId} svg`).attr('fill', '#DFFC00');
        $(`#slide-icon-${selectedIconId}`).css('border-color', '#DFFC00');

        $(this).addClass('selected');

        $.get(selectedIconSrc, function (data) {
            const svg = $(data).find('svg');
            svg.attr('fill', '#1D1E20');
            svg.find('style').html('.st0{fill:#currentColor;}');

            $('.card-icon').html(svg);
        });
    });

    // Обработка кликов на категории
    sliderCategoriesContainer.on('click', '.card_logo_category_slider_item', function () {
        const selectedCategoryId = $(this).data('category-id');

        $('.card_logo_category_slider_item').removeClass('active');
        $(this).addClass('active');

        const filteredIcons = cardIcons.filter(icon => {
            return selectedCategoryId === 0 || icon.categoryId === selectedCategoryId;
        });

        populateLogos(filteredIcons);
    });

    $('.card_logo_category_slider_item[data-category-id="0"]').addClass('active').click();
});
