function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // блокирует прокрутку страницы
    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId);// если пользователь сам открыл модалку очистить интервал
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {

    const modalTrigger = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    modalTrigger.forEach((btn) =>{
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });/* когда передаем колбэк фунцию в обработчик события ее нельзя сразу вызывать, ее нужно только объявить,
     поэтому openModal надо обернкть в стрелочную функцию */
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });
    /* закрытие модалки кликом на пустом экране и на крестик такая конструкция будет работать 
    с динамически сформированной версткой */

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && modal.style.display == 'block') {
            closeModal(modalSelector);
        }
    }); /* закрыть модальное окно кнопкой escape, вызывать данное действие 
    только если модальное окно активно*/

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    } // всплытие модалки при скролле до конца страницы, работает единожды
    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal};
export {closeModal};