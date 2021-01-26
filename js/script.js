window.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent () {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    }); //Tabs

    // Timer
    const deadline = '2021-02-20';
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)), // оператор % делит и возвращает остаток от деления
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock(); // запуск чтоб избежать отображения времени из верстки
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if   (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    } 

    setClock('.timer', deadline);

    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // блокирует прокрутку страницы
        clearInterval(modalTimerId);// если пользователь сам открыл модалку очистить интервал
    }
    modalTrigger.forEach((btn) =>{
        btn.addEventListener('click', openModal);
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    /* закрытие модалки кликом на пустом экране и на крестик такая конструкция будет работать 
    с динамически сформированной версткой */

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && modal.style.display == 'block') {
            closeModal();
        }
    }); /* закрыть модальное окно кнопкой escape, вызывать данное действие 
    только если модальное окно активно*/

    const modalTimerId = setTimeout(openModal, 50000);// автоматическое всплытие модалки

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    } // всплытие модалки при скролле до конца страницы, работает единожды
    window.addEventListener('scroll', showModalByScroll);

    //Используем классы для карточек меню
   
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

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
           throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }; /* свойство ".ok" - говорит о том что мы что-то получили и все в порядке
          свойство ".status" - статус котор вернул сервер (200, 404 и т.д.) */

    getResource('http://localhost:3000/menu') // запрос на сервер получает массив
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new menuItem(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); //деструктуризация объекта на отдельные свойства при помощи {}

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
    
     // Forms
     const forms = document.querySelectorAll('form');

     const message = {
         loading: 'img/form/spinner.svg',
         success: 'Спасибо! Скоро мы с вами свяжемся',
         failure: 'Что-то пошло не так...'
     };

     forms.forEach(item => {
        bindPostData(item);
     });

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

     function bindPostData(form) {
         form.addEventListener('submit', (e) => {
             e.preventDefault();

             const statusMessage = document.createElement('img');
             statusMessage.src = message.loading;
             statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
             `;
             form.insertAdjacentElement('afterend', statusMessage);

             

            //  const request = new XMLHttpRequest();
            //  request.open('POST', 'server.php');
             
            //  request.setRequestHeader('Content-type', 'application/json');
             /*в связке XMLHttpRequest и form-data заголовок setRequestHeader устанавливать не нужно */
             const formData = new FormData(form);
            //  request.send(formData);
            
            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });
            // const json = JSON.stringify(object);// трансформация FormData в JSON формат
            // То же самое более элегатно
            const json = JSON.stringify(Object.fromEntries(formData.entries())); /* Сперва
            берем formData превращаем в массив-массивов а затем превращаем ее в классический объект
            следом классический объект превращаем в json */
            

            // fetch('server.php', { // куда отправляем
            //     method: "POST", // каким образом
            //     headers: {
            //        'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object) // что именно
            // })

            postData('http://localhost:3000/requests', json)
            // .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() =>{
                form.reset();// очистил форму после отправки
            });
            
            //  request.addEventListener('load', () => {
            //      if (request.status === 200) {
            //          console.log(request.response);
            //          showThanksModal(message.success);
            //          form.reset();// очистил форму после отправки
            //          statusMessage.remove();
            //      } else {
            //         showThanksModal(message.failure);
            //      }
            //  });
         });
     }/* для того чтоб сервер смог получить данные у инпута или др. интерактивной части
     верстки должен быть прописан атрибут name
     Для того что бы изменения отработали на локальном сервере необходимо сбросить кэш
     в браузере на виндовс sift+F5 */

     function showThanksModal(message) {
         const prevModalDialog = document.querySelector('.modal__dialog');
         prevModalDialog.style.display = 'none';

         const thanksModal = document.createElement('div');
         thanksModal.classList.add('modal__dialog');
         thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close data-close">×</div>
                <div class="modal__title">${message}</div>
            </div>
         `;
         document.querySelector('.modal').append(thanksModal);
         openModal();

         setTimeout(() => {
             thanksModal.remove();
             prevModalDialog.style.display = 'block';
             closeModal();
         }, 4000);
     }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
}); // Window