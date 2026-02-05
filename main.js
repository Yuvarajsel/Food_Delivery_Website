document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       NAVBAR
    ========================= */
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");
    const navbar = document.querySelector(".navbar");

    hamburger.addEventListener("click", (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle("mobile-menu-active");
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("mobile-menu-active");
        });
    });

    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove("mobile-menu-active");
        }
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    });

    /* =========================
       ORDER NOW → MENU
    ========================= */
    const orderNowBtns = document.querySelectorAll(".order-now");

    orderNowBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#menu").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    /* =========================
       CART ELEMENTS
    ========================= */
    const cardList = document.querySelector(".card-list");
    const cartTab = document.querySelector(".cart-tab");
    const cartList = document.querySelector(".cart-list");
    const cartValue = document.querySelector(".cart-value");
    const cartTotal = document.querySelector(".cart-total");
    const cartIcon = document.querySelector(".cart-icon");
    const closeBtn = document.querySelector(".close-btn");

    let cart = [];

    /* =========================
       LOAD PRODUCTS
    ========================= */
    fetch("./Product.json")
        .then(res => {
            if (!res.ok) throw new Error("Product.json not found");
            return res.json();
        })
        .then(data => renderProducts(data))
        .catch(err => console.error(err));

    function renderProducts(products) {
        cardList.innerHTML = "";

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "order-card";

            card.innerHTML = `
                <div class="card-image">
                    <img src="${product.image}">
                </div>
                <h4>${product.name}</h4>
                <h4 class="price">${product.price}</h4>
                <a href="#" class="btn add-to-cart">Add to cart</a>
            `;

            card.querySelector(".add-to-cart").addEventListener("click", (e) => {
                e.preventDefault();
                addToCart(product);
            });

            cardList.appendChild(card);
        });
    }

    /* =========================
       ADD TO CART
    ========================= */
    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
    }

    /* =========================
       UPDATE CART
    ========================= */
    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price.replace("$", ""));
            total += price * item.quantity;
            count += item.quantity;

            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}">
                </div>
                <div>
                    <h4>${item.name}</h4>
                    <h4 class="item-total">$${(price * item.quantity).toFixed(2)}</h4>
                </div>
                <div class="flex">
                    <a href="#" class="quantity-btn minus">
                        <i class="fa-solid fa-minus"></i>
                    </a>
                    <h4 class="quantity-value">${item.quantity}</h4>
                    <a href="#" class="quantity-btn plus">
                        <i class="fa-solid fa-plus"></i>
                    </a>
                </div>
            `;

            div.querySelector(".plus").onclick = () => {
                item.quantity++;
                updateCart();
            };

            div.querySelector(".minus").onclick = () => {
                item.quantity--;
                if (item.quantity === 0) {
                    cart = cart.filter(i => i.id !== item.id);
                }
                updateCart();
            };

            cartList.appendChild(div);
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartValue.textContent = count;
    }

    /* =========================
       CART TOGGLE
    ========================= */
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        cartTab.classList.add("cart-tab-active");
    });

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        cartTab.classList.remove("cart-tab-active");
    });

    /* =========================
       SWIPER
    ========================= */
    new Swiper(".mySwiper", {
        loop: true,
        navigation: {
            nextEl: "#next",
            prevEl: "#prev",
        }
    });

});
