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
// будем создавать список товаров выводя данные из нашего удаленного апи
// ***
const productList = document.querySelector('.store__list');

const createProductCard = (product) => {
    console.log('product: ', product);
    const productCard = document.createElement('store__itemli');
    productCard.classList.add('store__item');
    productCard.innerHTML = `
    <article class="store__product product">
        <img class="product__img" src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388" height="261">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price">${product.price}&nbsp;₽</p>
        <button class="product__btn-add-cart btn btn--purple">Заказать</button>
    </article>
    `;

    return productCard;
};

// функция для очистки старого списка, перебора нового списка и отрисовки (рендера) нового
const renderProducts = (products) => {
    productList.textContent = '';
    products.forEach((product) => {
        // console.log(product);
        const productCard = createProductCard(product); //создаем карточки продуктом
        productList.append(productCard); //вставляем карточки на страницу
    });
};

// обратить внимание, что тут используем async..await --> мы делаем нашу функцию асинхронной
const fetchProductByCategory = async (category) => { // запрашиваем данные
    try {
        // будем обращаться к нашему серверу для получения данных
        const response = await fetch(
            `${API_URL}/api/products/category/${category}`,
        );

        // так как 404ая ошибка не выводится в catch по умолчанию, то мы её добавим сами для вывода.
        // И выведем эту ошибку
        if (!response.ok) {
            throw new Error(response.status);
        }

        //если ошибки 404 нет, то далее мы получим список наших продуктов:
        const products = await response.json();
        //console.log(products);

        renderProducts(products);

    } catch (error) {
        console.error(`Ошибка запроса категорий товаров: ${error}`);
    }
};

fetchProductByCategory('Домики');