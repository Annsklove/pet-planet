// $ Созадли удаленный сервер на глитче, залив туда нашу готовую АПИ
// сервер: https://glitch.com/edit/#!/freezing-agreeable-store?path=README.md%3A1%3A0
export const API_URL = 'https://freezing-agreeable-store.glitch.me'; // /api/products/category

const fetchData = async (endpoint, option = {}) => {
    // try...catch --> для обработки ошибок
    try {
        // обращаемся (делаем запрос) к нашему серверу для получения данных
        const response = await fetch(`${API_URL}${endpoint}`, option);
        // так как 404ая ошибка не выводится в catch по умолчанию, то мы её добавим сами для вывода.
        // И выведем эту ошибку
        if (!response.ok) throw new Error(response.status);

        // если ошибки 404 нет, то далее мы получим список наших продуктов:
        // Преобразует ответ в формат JSON и сохраняет в переменную products
        return await response.json();
    } catch (error) {
        console.error(`Ошибка запроса ${error}`);
    }
}

// $ Асинхронная функция (async..await) для получения продуктов определенной категории с сервера
// запрашиваем данные:
export const fetchProductsByCategory = (category) =>
    fetchData(`/api/products/category/${category}`);


export const fetchCartItems = async (ids) =>
    fetchData(`/api/products/list/${ids.join(",")}`);

// #
// # теперь нужно отправить данные ИЗ карзина --> на сервер
// #
export const submitOrder = async (storeId, products) =>
    fetchData(`/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId, products }),
    });