import {getResource} from '../services/services';

function cards() {

    const menuItems = document.querySelectorAll('.menu__item');
    menuItems.forEach(i => i.remove());

    class menuItem {
        constructor(image, alt, subtitle, text, price, parentSelector, ...classes) {
            this.image = image;
            this.alt = alt;
            this.subtitle = subtitle;
            this.text = text;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 29;
            this.changeToUAH();//запустит метод и вернет готвое значение
        }
        changeToUAH() {
        this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.image} alt=${this.alt}>
                <h3 class="menu__item-subtitle">Меню ${this.subtitle}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu') // запрос на сервер получает массив
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new menuItem(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); //деструктуризация объекта на отдельные свойства при помощи {}

    // axios.get('http://localhost:3000/menu')
    //     .then(data => {
    //         data.data.forEach(({img, altimg, title, descr, price}) => {
    //             new menuItem(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     }); // обращаемся к получеенному объекту, берем только данные data внутри этого объекта

    // new menuItem(
    //     "img/tabs/vegy.jpg",
    //     "vegy",
    //     '"Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     9,
    //     '.menu .container'
    // ).render();
    // new menuItem(
    //     "img/tabs/elite.jpg",
    //     "elite",
    //     '“Премиум”',
    //     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    //     20,
    //     '.menu .container'
    // ).render();
    // new menuItem(
    //     "img/tabs/post.jpg",
    //     "post",
    //     '"Постное"',
    //     'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
    //     15,
    //     '.menu .container'
    // ).render();
}

export default cards;