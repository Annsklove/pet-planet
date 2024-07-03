import { API_URL } from './api';

// #
// # функция для создания завтрашней даты
// #
const tomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const options = { day: 'numeric', month: 'long', yeat: 'numeric' };
    return tomorrow.toLocaleDateString('ru-RU', options);
};
// #
// # ф-ия для вывода сообщения после заказа
// #
const createOrderMessage = (id) => {
    const orderMessageElement = document.createElement('div');
    orderMessageElement.classList.add('order-message');

    const orderMessageText = document.createElement('p');
    orderMessageText.classList.add('order-message__text');
    const orderDate = tomorrowDate();
    orderMessageText.innerHTML = `Ваш заказ оформлен!<br> Номер заказа: ${orderId}.<br> Вы можете его забрать завтра (${orderDate}) после 12:00`

    const orderMessageCloseButton = document.createElement('button');
    orderMessageCloseButton.classList.add('order-message__close-button');
    orderMessageCloseButton.textContent = 'Закрыть';

    orderMessageElement.append(orderMessageText, orderMessageCloseButton);

    orderMessageCloseButton.addEventListener('click', () => {
        orderMessageElement.remove();
    });

    return orderMessageElement;
}

// #
// # ф-ия дял Вызова API с удаленного сервера и работа с данными
// #

// $ Созадли удаленный сервер на глитче, залив туда нашу готовую АПИ
// $ будем создавать список товаров выводя данные из нашего удаленного API

// $ функция для создания карточки товара.
//На вход получает данные переданные в product
const createProductCard = ({ id, photoUrl, name, price }) => {
    // console.log('product: ', product);
    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
    <article class="store__product product">
        <img class="product__img" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="261">
        <div class="product__content">
        <h3 class="product__title">${name}</h3>
        <p class="product__price">${price}&nbsp;₽</p>
        <button class="product__btn-add-cart btn btn--purple"data-id="${id}">Заказать</button>
    </article>
    `;

    return productCard; //Возвращает созданный элемент карточки продукта.
};

// $ функция для отображение (рендеринга) товаров на странице
export const renderProducts = (products, productList) => {
    productList.textContent = ''; //очищаем старое содержимое, чтобы перед добавлением очистить список товаров
    products.forEach((product) => { //проходим по массиву и для каждого продукта создаем карточку
        // console.log(product);
        const productCard = createProductCard(product); //создаем карточки продуктом
        productList.append(productCard); //вставляем карточки в список на страницу
    });
};

// #
// # ф-ия отображения добавленных товаров в карзине
// #
const renderCartItems = async () => {
    cartItemsList.textContent = '';  //очищаем этот контейнер
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const products = JSON.parse(
        localStorage.getItem('cartProductDetails') || '[]',
    );

    products.forEach(({ id, photoUrl, name, price }) => {
        const cartItem = cartItems.find((item) => item.id === id);
        if (!cartItem) {
            return;
        }

        const listItem = document.createElement('li');
        listItem.classList.add('modal__cart-item');
        listItem.innerHTML = `
            <img class="modal__cart-item-image" src="${API_URL}${photoUrl}" alt="${name}">
            <h3 class="modal__cart-item-title">${name}</h3>
            <div class="modal__cart-otem-count">
                <button class="modal__btn modal__minus" data-id=${id}>-</button>
                <span class="modal__count">${cartItem.count}</span>
                <button class="modal__btn modal__plus" data-id=${id}>+</button>
            </div>
            <p class="modal__cart-item-price">${price * cartItem.count}&nbsp;₽</p>
        `;

        cartItemsList.append(listItem);
    });

    const totalPrice = calculateTotalPrice(cartItems, products);
    cartTotalPticeElement.innerHTML = `${totalPrice}&nbsp;₽`;
};
