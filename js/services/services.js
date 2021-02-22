const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    }); /* т.к. внутри функции асинхронный код необходимо дождаться ответ сервера
    только потом присвоить значение в переменную res - используем  в паре async await */

    return await res.json(); // возвращает промис который можно дальше обработать
};

const getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
}; /* свойство ".ok" - говорит о том что мы что-то получили и все в порядке
    свойство ".status" - статус котор вернул сервер (200, 404 и т.д.) */

export {postData};
export {getResource};