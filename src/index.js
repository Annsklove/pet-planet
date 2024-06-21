// $ Созадли удаленный сервер на глитче, залив туда нашу готовую АПИ
const API_URL = 'https://freezing-agreeable-store.glitch.me'; // /api/products/category

const buttons = document.querySelectorAll('.store__category-button');
// контейнер, куда будем добавлять наши товары
const productList = document.querySelector('.store__list');
const cartButton = document.querySelector('.store__cart-button');
const cartCount = cartButton.querySelector('.store__cart-cnt')

const modalOverlay = document.querySelector('.modal-overlay');
const cartItemsList = document.querySelector('.modal__cart-items');
const modalCloseButton = document.querySelector('.modal-overlay__close-button');

// #
// # ф-ия дял Вызова API с удаленного сервера и работа с данными
// #

// $ Созадли удаленный сервер на глитче, залив туда нашу готовую АПИ
// $ будем создавать список товаров выводя данные из нашего удаленного API

// $ функция для создания карточки товара.
//На вход получает данные переданные в product
const createProductCard = ({ photoUrl, name, price }) => {
    // console.log('product: ', product);
    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
    <article class="store__product product">
        <img class="product__img" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="261">
        <div class="product__content">
        <h3 class="product__title">${name}</h3>
        <p class="product__price">${price}&nbsp;₽</p>
        <button class="product__btn-add-cart btn btn--purple">Заказать</button>
        </div>
    </article>
    `;

    return productCard; //Возвращает созданный элемент карточки продукта.
};

// $ функция для отображение (рендеринга) товаров на странице
const renderProducts = (products) => {
    productList.textContent = ''; //очищаем старое содержимое, чтобы перед добавлением очистить список товаров
    products.forEach((product) => { //проходим по массиву и для каждого продукта создаем карточку
        // console.log(product);
        const productCard = createProductCard(product); //создаем карточки продуктом
        productList.append(productCard); //вставляем карточки в список на страницу
    });
};

// $ Асинхронная функция (async..await) для получения продуктов определенной категории с сервера
// запрашиваем данные:
const fetchProductByCategory = async (category) => {    // try...catch --> для обработки ошибок
    try {
        // обращаемся (делаем запрос) к нашему серверу для получения данных
        const response = await fetch(
            `${API_URL}/api/products/category/${category}`,
        );

        // так как 404ая ошибка не выводится в catch по умолчанию, то мы её добавим сами для вывода.
        // И выведем эту ошибку
        if (!response.ok) {
            throw new Error(response.status);
        }

        // если ошибки 404 нет, то далее мы получим список наших продуктов:
        // Преобразует ответ в формат JSON и сохраняет в переменную products
        const products = await response.json();
        // console.log(products);

        // иначе если запрос успешный, данные товаров преобразуются из формата JSON
        // Вызываем функцию renderProducts, передавая ей массив продуктов для рендеринга из нашего JSON
        renderProducts(products);

    } catch (error) {
        console.error(`Ошибка запроса категорий товаров: ${error}`);
    }
};



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

// #
// # ф-ия отображения добавленных товаров в карзине
// #
const renderCartItems = () => {
    //очищаем этот контейнер
    cartItemsList.textContent = '';
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    cartItems.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        cartItemsList.append(listItem);
    });
};


// #
// # ф-ия показа/скрытия модального окна (карзина)
// #
cartButton.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    // далее будем отображать добавленные товары
    renderCartItems();
});
modalOverlay.addEventListener('click', ({ target }) => {
    if (target === modalOverlay ||
        target.closest('.modal-overlay__close-button')
    ) {
        modalOverlay.style.display = 'none';
    }
});


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

updateCartCount();

const addToCart = (productName) => {
    // будем получить данные из локального хранилища или пустой массив (если этих данных нет)
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(productName);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
};

productList.addEventListener('click', ({ target }) => {
    // console.log('target: ', target);
    // Если мы кликаем по кнопке product__btn-add-cart ИЛИ по эллементы в этой кнопке (за это отвечает closest), то ...
    if (target.closest('.product__btn-add-cart')) {
        // ... то добавляем товар в карзину
        const productCard = target.closest('.store__product');
        const productName = productCard.querySelector('.product__title').textContent;
        addToCart(productName);
    }
});

// tests