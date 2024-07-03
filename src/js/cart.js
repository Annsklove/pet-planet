const cartButton = document.querySelector('.store__cart-button');
const cartCount = cartButton.querySelector('.store__cart-cnt')
const modalOverlay = document.querySelector('.modal-overlay');
const cartItemsList = document.querySelector('.modal__cart-items');
const modalCloseButton = document.querySelector('.modal-overlay__close-button');
const cartTotalPticeElement = document.querySelector('.modal__cart-price');
const cartForm = document.querySelector('.modal__cart-form');

const calculateTotalPrice = (cartItems, products) => cartItems.reduce((acc, item) => {
    const product = products.find(prod => prod.id === item.id);
    return acc + product.price * item.count;
}, 0);

// #
// # ф-ия добавление в карзину
// #
// это мы будем осуществлять с помощью localStorage
// localStorage.setItem('cartItems', JSON.stringify(["привет", "hello"]));

// это функция для обновления счетчика товаров
const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartCount.textContent = cartItems.length;
};

const addToCart = (productId) => {
    // будем получить данные из локального хранилища или пустой массив (если этих данных нет)
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    const existingItem = cartItems.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.count += 1;
    } else {
        cartItems.push({ id: productId, count: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
};

// #
// # ф-ия обновление счетчика +/- у элемента в карзине
// #
const updateCartItem = (productId, change) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const itemIndex = cartItems.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cartItems[itemIndex].count += change;

        if (cartItems[itemIndex].xount <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        updateCartCount();
        renderCartItems();
    }
};

cartItemsList.addEventListener('click', ({ target }) => {
    if (target.classList.contains('modal__plus')) {
        const productId = target.dataset.id;
        updateCartItem(productId, 1);
    }

    if (target.classList.contains('modal__minus')) {
        const productId = target.dataset.id;
        updateCartItem(productId, -1);
    }
});

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
// # ф-ия отображения добавленных товаров в карзине
// # ф-ия показа/скрытия модального окна (карзина)
// #
cartButton.addEventListener('click', async () => {
    modalOverlay.style.display = 'flex';

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const ids = cartItems.map((item) => item.id);

    // Будем выводить сообщение, если в карзину не будет добавлено ни одной позиции
    if (!ids.length) { //проверяем, если длина элемента = 0, то:
        cartItems.textContent = '';
        const listItem = document.createElement('li'); //создаем эллемент
        listItem.textContent = 'Корзина пуста';
        cartItemsList.append(listItem); //вставляем этот элемент
        return;
    }

    const products = await fetchCartItems(ids);
    localStorage.setItem('cartProductDetails', JSON.stringify(products));
    // далее будем отображать добавленные товары:
    renderCartItems();
});
modalOverlay.addEventListener('click', ({ target }) => {
    if (target === modalOverlay ||
        target.closest('.modal-overlay__close-button')
    ) {
        modalOverlay.style.display = 'none';
    }
});

cartForm.addEventListener('submit', async (e) => {
    //фи-я обработки сабмита
    e.preventDefault(); //отключаем стандартное поведение формы после сабмина (отключаем перезагрузку страницы):

    const storeId = cartForm.store.value;
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log('cartItems: ', cartItems);

    const products = cartItems.map(({ id, count }) => ({
        id,
        quantity: count,
    }));

    const { orderId } = await submitOrder(storeId, products);

    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartProductDetails');

    const orderDate = tomorrowDate();
    orderMessageText.innerHTML = `Ваш заказ оформлен!<br> Номер заказа: ${orderId}.<br> Вы можете его забрать завтра (${orderDate}) после 12:00`
    document.body.append(orderMessageElement);

    modalOverlay.style.display = "none";
    updateCartCount();
});

updateCartCount();