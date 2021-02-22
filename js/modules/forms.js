import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
    bindPostData(item);
    });

    

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
    } /* для того чтоб сервер смог получить данные у инпута или др. интерактивной части
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
        openModal('.modal', modalTimerId);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModal('.modal');
        }, 4000);
    }

// fetch('http://localhost:3000/menu')
//     .then(data => data.json())
//     .then(res => console.log(res));
}

export default forms;