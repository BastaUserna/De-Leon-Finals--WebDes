const products = [];
const cart = [];

function showpasslogin() {
    var a = document.getElementById("pass");

    if (a.type === "password") {
        a.type = "text";
    } else {
        a.type = "password";
    }
}

function showpassreg() {
    var a = document.getElementById("registerPassword");

    if (a.type === "password") {
        a.type = "text";
    } else {
        a.type = "password";
    }
}

function isLoggedIn() {
	return sessionStorage.getItem('loggedIn') === 'true';
}
		
function redirectToLogin() {
	if (!isLoggedIn() && !window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
		alert("Warning: Not yet logged in. Your shopping cart will be deleted if not logged in.");
	}
}
function register() {
    var regUsernameField = document.getElementById("registerUsername");
    var regPasswordField = document.getElementById("registerPassword");

    if (regUsernameField.value === "" || regPasswordField.value === "") {
        alert("Registration Unsuccessful. Please fill in all fields.");
    } else {
        sessionStorage.setItem("regUsername", regUsernameField.value);
        sessionStorage.setItem("regPassword", regPasswordField.value);
        
        alert("Registration Successful!");
        window.location.replace("login.html");
    }
}

function validate() {
	var usernameField = document.getElementById("name");
	var passwordField = document.getElementById("pass");

	var regUsername = sessionStorage.getItem("regUsername");
	var regPassword = sessionStorage.getItem("regPassword");

	if (regUsername !== null && regPassword !== null && usernameField.value === regUsername && passwordField.value === regPassword) {
		alert("Login Successful");
		sessionStorage.setItem('loggedIn', 'true');
		window.location.replace("index.html");
	} else {
		alert("Login Failed");
	}
}

function checkout() {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
		alert('Not yet logged in');
        window.location.replace("login.html");
        return;
    }

    let totalAmount = 0;
    let receipt = "Receipt\n";

    cart.forEach(item => {
        const productId = item.product_id;
        const productInfo = products.find(product => product.id == productId);
        const productName = productInfo.name;
        const productPrice = productInfo.price;
        const productQuantity = item.quantity;
        const totalProductPrice = productPrice * productQuantity;
        totalAmount += totalProductPrice;

        receipt += `${productName} = ₱${totalProductPrice}\n`;
    });

    receipt += `Total: ₱${totalAmount}`;
    alert(receipt);
    const orderAgain = confirm("Would you like to order again?");
    if (orderAgain) {
        cart.length = 0;
        addCartToHTML();
    } else {
        alert("Thank you for shopping!");
        window.location.replace("login.html");
    }
}

document.addEventListener("DOMContentLoaded", function() {
	redirectToLogin();
    const listProductHTML = document.querySelector('.pro-collection');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    const addDataToHTML = () => {
        if(products.length > 0)
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                listProductHTML.appendChild(newProduct);
            });
        }
    }

    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart1')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    });

    const addToCart = (product_id) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
        if(cart.length <= 0){
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        }else if(positionThisProductInCart < 0){
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        }else{
            cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
        }
        addCartToHTML();
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if(cart.length > 0){
            cart.forEach(item => {
                totalQuantity = totalQuantity +  item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                    ${info.name}
                    </div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus">></span>
                    </div>
                `;
            })
        }
        totalQuantity = totalQuantity || 0;
        iconCartSpan.innerText = totalQuantity;
    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if(positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantityCart(product_id, type);
        }
    });

    const changeQuantityCart = (product_id, type) => {
        let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
        if(positionItemInCart >= 0){
            let info = cart[positionItemInCart];
            switch (type) {
                case 'plus':
                    cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                    break;
            
                default:
                    let changeQuantity = cart[positionItemInCart].quantity - 1;
                    if (changeQuantity > 0) {
                        cart[positionItemInCart].quantity = changeQuantity;
                    }else{
                        cart.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        addCartToHTML();
    }

    const initApp = () => {
        products.push({
            id: 1,
            name: "Bewitched",
            price: 30,
            image: "leyvey.jpg"
        });
		products.push({
            id: 2,
            name: "Cherry Bomb",
            price: 30,
            image: "911.jpg"
        });
		products.push({
            id: 3,
            name: "SCENERY",
            price: 30,
            image: "jaz.webp"
        });
		products.push({
            id: 4,
            name: "Thriller",
            price: 30,
            image: "MJ.webp"
        });
		products.push({
            id: 5,
            name: "Here comes the cowboy",
            price: 30,
            image: "demarc.webp"
        });
		products.push({
            id: 6,
            name: "Totoro OST",
            price: 30,
            image: "totoro.webp"
        });
        addDataToHTML();
    }    
    initApp();
});
