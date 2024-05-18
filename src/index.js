// ***
// отображение активного пункта в фильтре товаров
// ***
const buttons = document.querySelectorAll('.store__category-button');

const chacgeActiveBtn = (event) => {
    const target = event.target;

    buttons.forEach((button) => {
        button.classList.remove('store__category-button--active');
    });

    target.classList.add('store__category-button--active');
};

buttons.forEach((button) => {
    button.addEventListener('click', chacgeActiveBtn)
});


// ***
// Созадли удаленные сервер на глитче, залив туда нашу готовую АПИ
// ***

const API_URL = 'https://freezing-agreeable-store.glitch.me';
// /api/products/category


// ***
// будем создавать список товаров выводя данные из нашего удаленного API
// ***
const productList = document.querySelector('.store__list'); // контейнер, куда будем добавлять наши товары


// функция для создания карточки товара. 
const createProductCard = (product) => { //На вход получает данные переданные в product
    console.log('product: ', product);
    const productCard = document.createElement('li');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
    <article class="store__product product">
        <img class="product__img" src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388" height="261">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price">${product.price}&nbsp;₽</p>
        <button class="product__btn-add-cart btn btn--purple">Заказать</button>
    </article>
    `;

    return productCard; //Возвращает созданный элемент карточки продукта.
};

// функция для очистки старого списка, перебора нового списка и отрисовки (рендеринга) нового
const renderProducts = (products) => {
    productList.textContent = ''; //очищаем содержимое, чтобы перед добавлением очистить список товаров
    products.forEach((product) => { //проходим по массиву и для каждого продукта создаем карточку
        // console.log(product);
        const productCard = createProductCard(product); //создаем карточки продуктом
        productList.append(productCard); //вставляем карточки в список на страницу
    });
};

//Асинхронная функция (async..await) для получения продуктов по категории с сервера
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

        //если ошибки 404 нет, то далее мы получим список наших продуктов:
        //Преобразует ответ в формат JSON и сохраняет в переменную products
        const products = await response.json();
        //console.log(products);

        //Вызываем функцию renderProducts, передавая ей массив продуктов для рендеринга.
        renderProducts(products);

    } catch (error) {
        console.error(`Ошибка запроса категорий товаров: ${error}`);
    }
};

 //вызов функции: отправляет запрос на сервер для получения продуктов категории "Домики" и рендерит их на странице
fetchProductByCategory('Домики');
// fetchProductByCategory('Лежанки');
// fetchProductByCategory('Игрушки');
// fetchProductByCategory('Корма');