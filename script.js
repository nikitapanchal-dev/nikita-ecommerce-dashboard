const products = [
    { id: 1, name: "T-Shirt", price: 500, category: "clothing", img: "tshirt.jpg" },
    { id: 2, name: "Shoes", price: 1500, category: "clothing", img: "shoes.jpg" },
    { id: 3, name: "Watch", price: 2000, category: "accessories", img: "watch.jpg" },
    { id: 4, name: "Cap", price: 300, category: "accessories", img: "cap.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalItems = document.getElementById("total-items");
const totalPrice = document.getElementById("total-price");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

// Display products
function displayProducts(data) {
    productList.innerHTML = "";

    data.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${product.img}">
            <h4>${product.name}</h4>
            <p>₹${product.price}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            addToCart(product.id);
        });

        productList.appendChild(div);
    });
}

// Add to cart
function addToCart(id) {
    const item = cart.find(p => p.id === id);

    if (item) {
        item.qty++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
}

// Update cart + dashboard
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let items = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        items += item.qty;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} (x${item.qty}) - ₹${item.price * item.qty}
            <button onclick="removeItem(${index})">❌</button>
        `;

        cartItems.appendChild(li);
    });

    cartCount.innerText = items;
    totalItems.innerText = items;
    totalPrice.innerText = total;

    localStorage.setItem("cart", JSON.stringify(cart));
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Search + Filter
function applyFilters() {
    let filtered = products;

    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchValue)
    );

    if (filterValue !== "all") {
        filtered = filtered.filter(p => p.category === filterValue);
    }

    displayProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

// Init
displayProducts(products);
updateCart();
