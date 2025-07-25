
document.addEventListener("DOMContentLoaded", () => {
    const cartKey = "herbal_cart";
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    function getCart() {
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function extractProductData(card) {
        const name = card.querySelector("h3").textContent.trim();
        const priceText = card.querySelector(".product-price").textContent.trim();
        const priceMatch = priceText.match(/Rs\.?\s*([\d,]+)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
        const quantity = parseInt(card.querySelector(".quantity-input").value);

        return { name, price, quantity };
    }

    function renderCart() {
        const cartContainer = document.getElementById("cartContainer");
        const cart = getCart();
        cartContainer.innerHTML = "";
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cart.forEach((item, index) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: Rs.${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <hr>
            `;
            cartContainer.appendChild(div);
        });

        const checkoutBtn = document.createElement("button");
        checkoutBtn.textContent = "Checkout";
        checkoutBtn.style.padding = "10px 20px";
        checkoutBtn.style.fontSize = "16px";
        checkoutBtn.onclick = () => {
            fetch("http://localhost:3000/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart)
            })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                localStorage.removeItem(cartKey);
                renderCart();
            })
            .catch(err => {
                alert("Failed to place order.");
                console.error(err);
            });
        };
        cartContainer.appendChild(checkoutBtn);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");
            const product = extractProductData(card);
            const cart = getCart();
            const existing = cart.find(item => item.name === product.name);
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                cart.push(product);
            }
            saveCart(cart);
            alert("Added to cart!");
        });
    });

    // renderCart on cart page load
    if (document.getElementById("cartContainer")) {
        renderCart();
    }
});
