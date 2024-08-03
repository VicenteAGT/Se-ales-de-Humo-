document.addEventListener('DOMContentLoaded', () => {
    const notification = document.getElementById('notification');
    const letter = document.getElementById('letter');
    const waitingMessage = document.getElementById('waiting-message');
    const showLetterButton = document.getElementById('show-letter');
    const closeLetterButton = document.getElementById('close-letter');
    const messageList = document.getElementById('message-list');
    const resetButton = document.getElementById('reset-button');

    // Función para guardar mensajes en localStorage
    function saveMessages() {
        const messages = [];
        document.querySelectorAll('#message-list li').forEach(item => {
            messages.push({
                text: item.textContent,
                date: item.dataset.date
            });
        });
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Función para cargar mensajes desde localStorage
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.forEach(message => {
            const newMessage = document.createElement('li');
            newMessage.textContent = message.text;
            newMessage.dataset.date = message.date;
            newMessage.addEventListener('click', () => {
                notification.style.display = 'none';
                letter.style.display = 'block';
                waitingMessage.style.display = 'none';
            });
            messageList.appendChild(newMessage);
        });
    }

    // Verificar el estado de la carta y mostrar los mensajes apropiados
    function checkCardStatus() {
        const cardRead = localStorage.getItem('cardRead');
        if (cardRead) {
            notification.style.display = 'none';
            waitingMessage.style.display = 'block';
        } else {
            notification.style.display = 'block';
            showLetterButton.style.display = 'inline-block';
        }
    }

    // Verificar si la carta ya está en la bandeja de mensajes
    function isMessageInList(date) {
        return Array.from(messageList.children).some(item => item.dataset.date === date);
    }

    // Función para reiniciar todo
    function resetAll() {
        localStorage.removeItem('cardRead');
        localStorage.removeItem('messages');
        location.reload(); // Recargar la página para aplicar los cambios
    }

    // Agregar evento al botón de reinicio
    resetButton.addEventListener('click', resetAll);

    loadMessages(); // Cargar mensajes al iniciar
    checkCardStatus(); // Verificar el estado de la carta

    showLetterButton.addEventListener('click', () => {
        notification.style.display = 'none';
        letter.style.display = 'block';
    });

    closeLetterButton.addEventListener('click', () => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString(); // Formato de la fecha en dd/mm/yyyy

        // Cerrar la carta
        letter.style.display = 'none';
        waitingMessage.style.display = 'block';

        // Añadir el mensaje a la bandeja de mensajes leídos solo si no está ya en la lista
        if (!isMessageInList(formattedDate)) {
            const newMessage = document.createElement('li');
            newMessage.textContent = `Señal de Humo - ${formattedDate}`;
            newMessage.dataset.date = formattedDate; // Añadir la fecha como dato
            newMessage.addEventListener('click', () => {
                notification.style.display = 'none';
                letter.style.display = 'block';
                waitingMessage.style.display = 'none';
            });
            messageList.appendChild(newMessage);

            // Guardar los mensajes en localStorage
            saveMessages();
        }

        // Marcar la carta como leída
        localStorage.setItem('cardRead', 'true');
    });

    // Ocultar el mensaje de espera al hacer clic en la bandeja
    waitingMessage.addEventListener('click', () => {
        waitingMessage.style.display = 'none';
        notification.style.display = 'block';
    });
});
