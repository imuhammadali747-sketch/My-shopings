document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        // Send POST to backend
        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Xabar yuborildi! Email, Telegram va SMS orqali qabul qilindi.');
                    form.reset();
                } else {
                    alert('Xatolik yuz berdi: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Xatolik yuz berdi.');
            });
    });
});