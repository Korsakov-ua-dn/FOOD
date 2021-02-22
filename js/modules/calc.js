function calc() {
    // Calc
    const result = document.querySelector('.calculating__result span'), // ячейка для записи результата
          gender = document.querySelectorAll('#gender div'), // селектор пола
          activity = document.querySelectorAll('.calculating__choose_big div'); // селектор физической активности

    let sex = 'female', height, weight, age, ratio = '1.375'; // начальные параметры

    if (localStorage.sex) {
        sex = localStorage.sex;
    }
    if (localStorage.ratio) {
        ratio = localStorage.ratio;
    } // проверка хранилища на наличие ранее заполненых данных

    function changeActiveClass (selector, key, value) {
    selector.forEach( elem => {
        elem.classList.remove('calculating__choose-item_active');
        if (elem.getAttribute(key) === value) {
            elem.classList.add('calculating__choose-item_active');
        }
    });
    } // смена класса активности
    changeActiveClass(activity, 'data-ratio', ratio);
    changeActiveClass(gender, 'id', sex);

    function calcTotal () {
    if (!sex || !height || !weight || !age || !ratio) {
        result.textContent = "Заполните все поля";
        return; // прерываем выполнение функции далее
    } // проверка заполнения всех полей формы

    if (sex === 'male') {
        result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    } else {
        result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    }
    }
    calcTotal();

    function getStaticInformation () {
        activity.forEach(item => {
            item.addEventListener('click', (e) => {
                ratio = +e.target.getAttribute('data-ratio'); // значение атрибута присваиваем в переменную
                localStorage.setItem('ratio', e.target.getAttribute('data-ratio'));
                changeActiveClass(activity, 'data-ratio', e.target.getAttribute('data-ratio'));
                calcTotal();
            }); 
        });

        gender.forEach(item => {
            item.addEventListener('click', (e) => {
                sex = e.target.getAttribute('id'); // значение атрибута присваиваем в переменную
                localStorage.setItem("sex", e.target.getAttribute('id')); // значение атрибута записываем в localstorege
                changeActiveClass(gender, 'id', sex); // меняем класс активности
                calcTotal();
            });
        });
    }
    getStaticInformation();

    function getDynamicInformation (selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

export default calc;