
const buttons = document.querySelectorAll('.store__category-button');
// контейнер, куда будем добавлять наши товары
const productList = document.querySelector('.store__list');





const orderMessageElement = document.createElement('div');
orderMessageElement.classList.add('order-message');

const orderMessageText = document.createElement('p');
orderMessageText.classList.add('order-message__text');

const orderMessageCloseButton = document.createElement('button');
orderMessageCloseButton.classList.add('order-message__close-button');
orderMessageCloseButton.textContent = 'Закрыть';

orderMessageElement.append(orderMessageText, orderMessageCloseButton);

orderMessageCloseButton.addEventListener('click', () => {
    orderMessageElement.remove();
});

// #
// # ф-ия отображение активной категории
// #
const changeCategory = ({ target }) => {
    const category = target.textContent;

    buttons.forEach((button) => {
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
    fetchProductByCategory(category);
};

buttons.forEach((button) => {
    button.addEventListener('click', changeCategory);

    if (button.classList.contains('store__category-button--active')) {
        //вызов функции: отправляет запрос на сервер для получения продуктов категории "Домики" и рендерит их на странице
        fetchProductByCategory(button.textContent);
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

