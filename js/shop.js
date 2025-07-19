
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://yourusername.pythonanywhere.com/api/herbs')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('herbs-container');
            let total = 0;

            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
                    <img src="https://herbalpensar1.pythonanywhere.com/static/uploads/${item.image}" width="100"><br>
                    <strong>${item.name}</strong><br>
                    Price: PKR ${item.price}<br>
                    <button onclick="addToTotal(${item.price})">Add to Cart</button>
                `;
                container.appendChild(div);
            });
        });
});

function addToTotal(price) {
    const totalElem = document.getElementById('total');
    totalElem.textContent = parseInt(totalElem.textContent) + price;
}
