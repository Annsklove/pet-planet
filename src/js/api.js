// $ Созадли удаленный сервер на глитче, залив туда нашу готовую АПИ
// сервер: https://glitch.com/edit/#!/freezing-agreeable-store?path=README.md%3A1%3A0
const API_URL = 'https://freezing-agreeable-store.glitch.me'; // /api/products/category

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


const fetchCartItems = async (ids) => {
    try {
        const response = await fetch(`${API_URL}/api/products/list/${ids.join(",")}`,
        );

        if (!response.ok) {
            throw new Error(response.status);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка запроса товаров для корзины: ${error}`);
        return [];
    }
};


// #
// # теперь нужно отправить данные ИЗ карзина --> на сервер
// #
const submitOrder = async (storeId, products) => {
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storeId, products }),
        });

        if (!response.ok) {
            throw new Error(response.status);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка оформления заказа: ${error}`);
    }
};