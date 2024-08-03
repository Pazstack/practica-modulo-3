// Definición de la clase Producto - constructor!
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }  
}

// Definición de la clase Carrito
class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto, cantidad) {
        const existente = this.productos.find(item => item.nombre === producto.nombre);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            this.productos.push({ ...producto, cantidad });
        }
    }

    eliminarProducto(nombre) {
        this.productos = this.productos.filter(item => item.nombre !== nombre);
    }

    calcularTotal() {
        return this.productos.reduce((total, item) => total + item.precio * item.cantidad, 0);
    }

    vaciarCarrito() {
        this.productos = [];
    }
}

$(document).ready(function() {
    const carrito = new Carrito(); // Crea la instancia de Carrito
    const cartCount = $('#cart-count'); // Elemento del DOM que muestra la cantidad de productos en el carrito
    const cartDropdownContent = $('#cart-dropdown-content'); // Contenedor para los elementos del carrito en el menú desplegable
    const emptyCartMessage = $('#empty-cart-message'); // 
    function updateCartCount() {
        cartCount.text(carrito.productos.length); // Actualiza el texto del contador del carrito con la longitud del arreglo productos en carrito
    }

    function renderCart() {
        cartDropdownContent.empty(); // Vacía el carrito
        const total = carrito.calcularTotal(); 
        if (carrito.productos.length === 0) {
            emptyCartMessage.show(); // Muestra el mensaje si el carrito está vacío
        } else {
            emptyCartMessage.hide(); // Oculta el mensaje si el carrito no está vacío
            carrito.productos.forEach(item => {
                cartDropdownContent.append(`
                    <div class="cart-item">
                        <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
                        <button class="btn btn-danger btn-sm remove-item" data-product="${item.nombre}">Eliminar</button>
                    </div>
                `); 
            });

            cartDropdownContent.append(`
                <div class="cart-total">
                    <strong>Total: $${total}</strong>
                </div>
                <button class="btn btn-success btn-block mt-2" id="checkout">Pagar</button>
            `); // Añade el total y el botón de pago al contenedor del carrito
        }
    }

    function showAlert(message, type = 'success') {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `; // HTML para la alerta

        $('.container').prepend(alertHTML); // alerta al inicio del contenedor principal

        setTimeout(() => {
            $('.alert').alert('close'); // cierra la alerta después de 3 segundos
        }, 3000);
    }

    function confirmContinueShopping() {
        return new Promise((resolve) => {
            if (confirm('¿Quieres agregar más productos?')) {
                resolve(true); // true si el usuario confirma
            } else {
                resolve(false); // false si el usuario cancela
            }
        });
    }

    $(document).on('click', '.add-to-cart', async function() {
        const productName = $(this).data('product'); // Obtiene el nombre del producto del atributo data-product
        const productPrice = parseFloat($(this).data('price')); // Obtiene el precio del producto del atributo data-price y lo convierte a número
        const productQuantity = parseInt($(this).prev('.quantity-input').val()); // cantidad del producto del input anterior

        const producto = new Producto(productName, productPrice); // Crea una instancia de Producto

        carrito.agregarProducto(producto, productQuantity); // Agrega el producto al carrito

        updateCartCount(); // Actualiza el contador del carrito
        renderCart(); // renderiza<
        showAlert('Producto añadido al carrito'); 

        const continueShopping = await confirmContinueShopping(); 
        if (!continueShopping) {
            showAlert('Gracias por tu compra! Tus productos serán despachados a la brevedad.', 'success'); 
        }
    });

    $(document).on('click', '.remove-item', function() {
        const productName = $(this).data('product'); // Obtiene el nombre del producto del atributo data-product
        carrito.eliminarProducto(productName); 

        updateCartCount(); // actualiza el contador del carrito
        renderCart(); //  
        showAlert('Producto eliminado del carrito', 'danger'); 
    });

    $(document).on('click', '#checkout', function() {
        showAlert('Gracias por tu compra! Tus productos serán despachados a la brevedad.', 'success'); 
        carrito.vaciarCarrito(); 
        updateCartCount(); 
        renderCart();
    });

    renderCart();
});


// requerimientos:
//• Crea una clase Producto con los atributos ‘nombre’ y ‘precio’. (2 puntos) 
//• Crea la clase Carrito que tenga como atributo un arreglo para almacenar los productos seleccionados. (2 puntos)
//• Crea una función que permita agregar productos al carrito. (3 puntos)
//• Crea una función que permita calcular el total de la compra. (2 puntos)
//• Crea una función que permita finalizar la compra. (2 puntos)
//• Crea una función que permita mostrar los detalles de la compra. (2 puntos)
//• Valida que los datos que se ingresen correspondan con los productos vendidos y, de lo contrario, vuelve a solicitar al usuario que ingrese la información hasta que sea correcta. (2 puntos) X
//• Permite que el usuario siga agregando productos al carrito hasta que decida no continuar agregando más. (3 puntos).
//• Verifica que código esté bien estructurado, siga buenas prácticas y sea fácil de entender. (2puntos)
