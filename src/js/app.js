const pageLimit = 6;
let products;
let filteredProducts;

async function fetchProducts() {
    const response = await fetch("./json/products.json")
    if (response.ok) {
        products = await response.json()
        loadProducts(products)
        loadPagination(products)
    } else {
        console.log("Error!")
    }
}

async function fetchBrands() {
    const response = await fetch("./json/brands.json");
    if (response.ok) {
        let data = await response.json();
        loadBrands(data)
    } else {
        console.log("Network Error")
    }
}

async function postCart() {
    const response = await fetch("https://app.aaccent.su/js/confirm.php");
    if (response.ok) {
        let { result } = await response.json();
        if (result === "ok") {
            document.querySelector(".cart-page__popup").classList.add("cart-page__popup_open");
            document.body.classList.add("_lock")
        }
    } else {
        console.log("Network Error!")
    }
}
function loadProducts(data, pageNumber = 1) {
    const catalog = document.querySelector(".catalog__list");
    catalog.innerHTML = "";
    data.slice(pageLimit * (pageNumber - 1), pageNumber * pageLimit).forEach((product) => {
        let productTemplate = `
            <div class="catatlog__item product" data-product-id="${product.id}" data-brand-id="${product.brand}">
                <a class="product__img" href="#">
                    <img src=".${product.image}" alt="product"></a>
                <div class="product__body"> 
                <div class="product__title">${product.title}</div>
                <div class="product__price">
                    <span class="product__price-value">${product["regular_price"].value}</span>
                    <span class="product__price-currency">${product["regular_price"].currency}</span>
                </div>
                <div class="product__actions">
                    <button class="product__add-to-cart" type="button">Add to cart</button>
                </div>
            </div>
        `
        catalog.insertAdjacentHTML("beforeend", productTemplate);
    })
}

function loadPagination(products) {
    const pagesQuantity = Math.ceil(products.length / pageLimit);
    const pagination = document.querySelector(".catalog__pagination");
    pagination.innerHTML = "";
    if (pagesQuantity > 1) {
        for (let i = 0; i < pagesQuantity; i++) {
            pagination.insertAdjacentHTML("beforeend", `<span data-value="${i + 1}"}>${i + 1}</span>`)
        }   
    }
}

function loadBrands(data) {
    const brands = document.querySelector(".sidebar__filter-items");

    data.forEach(brand => {
        let brandTemplate = `
            <label class="sidebar__filter-item checkbox">
                <input class="checkbox__input" type="checkbox" value="${brand.id}">
                <span class="checkbox__box"></span>
                <span class="checkbox__title">${brand.title}</span>
            </label>
        `
        brands.insertAdjacentHTML("beforeend", brandTemplate)
    })
}

function addToCard(productButton) {
    const cartQuantity = document.querySelector(".header__cart span");
    const currentProduct = productButton.closest(".product");
    const productId = currentProduct.dataset.productId;
    const productImage = currentProduct.querySelector("img");
    const productTitle = currentProduct.querySelector(".product__title");
    const productPrice = currentProduct.querySelector(".product__price");

    const cartProductList = document.querySelector(".cart-page__product-list");
    const cartProduct = cartProductList.querySelector(`.cart-product[data-product-id="${productId}"`);

    productButton.classList.add("product__add-to-cart_disabled")

    if (!cartQuantity) {
        cartProductList.innerHTML = ""
    }

    if (cartProduct) {
        updateCart(cartProduct)
    } else {
        let productCartTemplate = `
            <div class="cart-product" data-product-id="${currentProduct.dataset.productId}" data-product-price="${productPrice.firstElementChild.innerHTML}">
                <div class="cart-product__image">
                    <img src="${productImage.getAttribute("src")}">
                </div>
                <div class="cart-product__body">
                    <div class="cart-product__title">${productTitle.innerHTML}</div>
                    <div class="cart-product__controls">
                        <span class="cart-product__button cart-product__button_minus">-</span>
                        <div class="cart-product__quantity">1</div>
                        <span class="cart-product__button cart-product__button_plus">+</span>
                    </div>
                    <div class="cart-product__price">
                        <span class="cart-product__price-value">${productPrice.querySelector(".product__price-value").innerHTML}</span>
                        <span class="cart-product__price-currency">${productPrice.querySelector(".product__price-currency").innerHTML}</span>
                    </div>
                </div>
            </div>
        `
        // Вынести в отдельную функцию ??
        const cartTotalSum = document.querySelector(".cart-page__total-sum span");
        cartProductList.insertAdjacentHTML("beforeend", productCartTemplate);
        cartTotalSum.innerHTML = Math.round((+cartTotalSum.innerHTML + +productPrice.firstElementChild.innerHTML) * 100) / 100;
        document.querySelector(".cart-page__order-button").classList.remove("_disabled")
    }

    if (cartQuantity) {
        cartQuantity.innerHTML = +cartQuantity.innerHTML + 1
    } else {
        document.querySelector(".header__cart").insertAdjacentHTML("beforeend", `<span class="header__cart-quantity">1</span>`)
    }

    setTimeout(() => {
        productButton.classList.remove("product__add-to-cart_disabled")
    }, 800)
    
}

function updateCart(product, add = true) {
    let productQuantity = product.querySelector(".cart-product__quantity");
    let productPrice = product.querySelector(".cart-product__price-value");
    let cartTotalSum = document.querySelector(".cart-page__total-sum span");
    let cartQuantity = document.querySelector(".header__cart-quantity");

    let mul = add ? 1 : -1;

    if (mul == -1  && productQuantity.innerHTML === "1") {
        product.remove();
    } else {
        productQuantity.innerHTML = +productQuantity.innerHTML + mul;
    }
    
    productPrice.innerHTML = Math.round((+productPrice.innerHTML + mul * parseFloat(product.dataset.productPrice)) * 100) / 100
    cartTotalSum.innerHTML = Math.round((+cartTotalSum.innerHTML + mul * parseFloat(product.dataset.productPrice)) * 100) / 100
    
    if (cartQuantity.innerHTML === "1" && mul === - 1) {
        cartQuantity.remove();
        document.querySelector(".cart-page__product-list").insertAdjacentHTML("beforeend","<p>Cart is empty!</p>");
        document.querySelector(".cart-page__order-button").classList.add("_disabled")
    } else {
        cartQuantity.innerHTML = +cartQuantity.innerHTML + mul
        if (document.querySelector(".cart-page__order-button").classList.contains("_disabled")) {
            document.querySelector(".cart-page__order-button").classList.remove("_disabled")
        }
    }
}

function clearCart() {
    document.querySelector(".cart-page__product-list").innerHTML = "<p>Cart is Empty</p>";
    document.querySelector(".cart-page__total-sum span").innerHTML = 0;
    document.querySelector(".cart-page__popup").classList.remove("cart-page__popup_open");
    document.querySelector(".header__cart-quantity").remove();

    document.body.classList.remove("cart");
    document.body.classList.remove("_lock")
}

function filterProducts(filterArray) {
    filteredProducts = products.filter(product => filterArray.indexOf(product.brand) !== -1)
    loadProducts(filteredProducts)
    loadPagination(filteredProducts)
}

document.addEventListener("click", e => {
    const targetElement = e.target;

    if (targetElement.classList.contains("product__add-to-cart")) {
        addToCard(e.target)
    }

    if (targetElement.closest(".catalog__pagination")) {
        loadProducts(products, targetElement.dataset.value)
    }

    if (targetElement.classList.contains("cart-product__button")) {
        let currentProduct = targetElement.closest(".cart-product");
        if (targetElement.classList.contains("cart-product__button_minus")) {
            updateCart(currentProduct, false)
        } else { 
            updateCart(currentProduct)
        }
    }

    if (targetElement.classList.contains("header__cart-icon") || targetElement.closest(".header__cart-icon")) {
        e.preventDefault()
        document.body.classList.toggle("cart");
    }

    if (targetElement.classList.contains("header__logo")) {
        e.preventDefault();
        document.body.classList.remove("cart")
    }

    if (targetElement.classList.contains("cart-page__order-button") && !targetElement.classList.contains("_disabled")) {
        postCart()
    }

    if (targetElement.closest(".cart-page__popup-close") || targetElement.classList.contains("cart-page__popup-container")) {
        clearCart()
    }

    if (targetElement.classList.contains("sidebar__filter-button") || targetElement.closest(".sidebar__filter-button") ) {
        const sidebarFilter = document.querySelector(".sidebar__filter");
        if (targetElement.classList.contains("sidebar__filter-button_apply")) {
            const checkboxes = sidebarFilter.querySelectorAll("input[type='checkbox']:checked");
            const arrValues = [];
            checkboxes.forEach(checkbox => {
                arrValues.push(+checkbox.value)
            })
            filterProducts(arrValues);
        }

        if (targetElement.closest(".sidebar__filter-button_clear")) {
            const checkboxes = sidebarFilter.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(checkbox => checkbox.checked = false)
            loadProducts(products)
            loadPagination(products)
            // clearButton.classList.add("_disabled")
        }
    }
})  

fetchProducts()
fetchBrands()