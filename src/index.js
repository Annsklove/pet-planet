import { fetchProductsByCategory } from "./js/api";
import { addToCart } from './js/cart';
import { renderProducts } from './js/dom';

const init = () => {
    const buttons = document.querySelectorAll('.store__category-button');
    const productList = document.querySelector('.store__list'); // контейнер, куда будем добавлять наши товары

    // #
    // # ф-ия отображение активной категории
    // #
    const changeCategory = async ({ target }) => {
        const category = target.textContent;

        buttons.forEach((button) => {
            button.classList.remove('store__category-button--active');
        });

        target.classList.add('store__category-button--active');

        const products = await fetchProductsByCategory(category);
        renderProducts(products, productList);
    };


    buttons.forEach((button) => {
        button.addEventListener('click', changeCategory);

        if (button.classList.contains('store__category-button--active')) {
            //вызов функции: отправляет запрос на сервер для получения продуктов категории "Домики" и рендерит их на странице
            // fetchProductsByCategory(button.textContent);
            changeCategory({ target: button });
        }
    });


    productList.addEventListener('click', ({ target }) => {
        // console.log('target: ', target);
        // Если мы кликаем по кнопке product__btn-add-cart ИЛИ по эллементы в этой кнопке (за это отвечает closest), то ...
        if (target.closest('.product__btn-add-cart')) {
            // ... то добавляем товар в карзину
            const productId = target.dataset.id;
            addToCart(productId);
        }
    });
};

init();