import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

(() => {
    'use strict';

    const firebaseConfig = {
        apiKey: "AIzaSyCRIuomfckaGnZjhcE8hHyRVFK_6t4qIzg",
        authDomain: "panaderia-d59f9.firebaseapp.com",
        projectId: "panaderia-d59f9",
        storageBucket: "panaderia-d59f9.appspot.com",
        messagingSenderId: "201059231911",
        appId: "1:201059231911:web:7f805183b61ca152a75382"
    };

    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let productos;
    let productoSeleccionado;

    // Instancia del modal de ver producto
    const verProductoModal = new bootstrap.Modal(document.getElementById('verProductoModal'));


    document.addEventListener('DOMContentLoaded', async function () {
        const productosContainer = document.getElementById('productos-container');
        const inputBusqueda = document.getElementById('busqueda');

        // Obtiene todos los productos desde Firebase
        const cargarProductos = async () => {
            try {
                const productosSnapshot = await getDocs(collection(db, 'Productos'));
                productos = productosSnapshot.docs.map(doc => doc.data());

                // Muestra los productos en tarjetas de Bootstrap
                mostrarProductos(productos);
            } catch (error) {
                console.error("Error al cargar productos desde Firebase: ", error);
                return [];
            }
        };

        cargarProductos(); // Llamada para cargar los productos al cargar la página

        inputBusqueda.addEventListener('input', function () {
            filtrarProductos(inputBusqueda.value.trim().toLowerCase());
        });

        function mostrarProductos(productos) {
            productosContainer.innerHTML = ''; // Limpia el contenido anterior

            productos.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-3');

                card.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <img src="../imagenes/coca.jpg" alt="" class="mx-auto d-block">
                                    <h5 class="card-title">${producto.Nombre}</h5>
                                    <p class="card-text">SKU: ${producto.Sku}</p>
                                    <p class="card-text">Valor Venta: ${producto.ValorVenta}</p>
                                </div>
                                <button type="button" class="btn btn-primary btn-lg btn-block" data-id="${producto.id}" data-bs-toggle="modal" data-bs-target="#verProductoModal">Ver Ficha Producto</button>
                            </div>
                        `;

                productosContainer.appendChild(card);
            });
        }

        function filtrarProductos(terminoBusqueda) {
            const productosFiltrados = productos.filter(producto =>
                producto.Nombre.toLowerCase().includes(terminoBusqueda)
            );

            mostrarProductos(productosFiltrados);
        }

        // Escucha el evento show.bs.modal (antes de que se muestre el modal)
        document.getElementById('verProductoModal').addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Botón que activó el modal
            const productId = button.getAttribute('data-id'); // Obtiene la id del producto

            // Asigna la ID del producto al botón "Eliminar" dentro del modal de confirmación
            document.getElementById('eliminarProductoBtn').setAttribute('data-id', productId);

            // Busca el producto por la id
            productoSeleccionado = productos.find(producto => producto.id === productId);

            // Muestra la información del producto en el modal
            if (productoSeleccionado) {
                document.getElementById('modalTitle').textContent = productoSeleccionado.Nombre;
                document.getElementById('modalId').textContent = `ID: ${productoSeleccionado.id}`;
                document.getElementById('modalSku').textContent = `SKU: ${productoSeleccionado.Sku}`;
                document.getElementById('modalBarra').textContent = `Codigo de Barras: ${productoSeleccionado.Barra}`;
                document.getElementById('modalFamilia').textContent = `Familia: ${productoSeleccionado.Familia}`;
                document.getElementById('modalStock').textContent = `Stock: ${productoSeleccionado.Stock}`;
                document.getElementById('modalStockCritico').textContent = `Stock Critico: ${productoSeleccionado.StockCritico}`;
                document.getElementById('modalValorCompra').textContent = `Valor Compra: ${productoSeleccionado.ValorCompra}`;
                document.getElementById('modalValorVenta').textContent = `Valor Venta: ${productoSeleccionado.ValorVenta}`;
                document.getElementById('modalGanancia').textContent = `Ganancia por unidad: ${productoSeleccionado.ValorVenta - productoSeleccionado.ValorCompra}`;
                // Otros campos del producto que desees mostrar en el modal
            }
        });

        // Escucha el evento click en el botón "Eliminar"
        document.getElementById('eliminarProductoBtn').addEventListener('click', function () {
            // Obtiene la ID del producto desde el botón "Eliminar"
            const productId = this.getAttribute('data-id');

            // Muestra el modal de confirmación
            const confirmarEliminarModal = new bootstrap.Modal(document.getElementById('confirmarEliminarModal'));

            confirmarEliminarModal.show();

            // Configura el evento click en el botón "Confirmar" dentro del modal de confirmación
            document.getElementById('confirmarEliminarBtn').addEventListener('click', async function () {
                // Lógica para eliminar el producto de la base de datos
                try {
                    await deleteDoc(doc(db, 'Productos', productId));

                    console.log('Producto eliminado correctamente');
                    // Cierra el modal de confirmación y el modal de ver producto
                    confirmarEliminarModal.hide();

                    // Recarga la lista de productos
                    cargarProductos();
                } catch (error) {
                    console.error('Error al eliminar el producto', error);
                }
            });

            // Cierra el modal de ver producto
            verProductoModal.hide();
        });

        document.getElementById('guardarCambiosBtn').addEventListener('click', async function () {
            // Lógica para guardar los cambios en el producto de la base de datos
            try {
                const nombreModificar = document.getElementById('nombreModificar').value;
                const familiaModificar = document.getElementById('familiaModificar').value;
                const stockModificar = parseInt(document.getElementById('stockModificar').value);
                const stockCriticoModificar = parseInt(document.getElementById('stockCriticoModificar').value);
                const valorCompraModificar = parseInt(document.getElementById('valorCompraModificar').value);
                const valorVentaModificar = parseInt(document.getElementById('valorVentaModificar').value);

                // Actualiza el producto en la base de datos
                await updateDoc(doc(db, 'Productos', productoSeleccionado.id), {
                    Nombre: nombreModificar,
                    Familia: familiaModificar,
                    Stock: stockModificar,
                    StockCritico: stockCriticoModificar,
                    ValorCompra: valorCompraModificar,
                    ValorVenta: valorVentaModificar,
                    // Actualiza más campos según sea necesario

                });

                console.log('Cambios guardados correctamente');
                // Cierra el modal de modificar producto
                const modificarProductoModal = new bootstrap.Modal(document.getElementById('modificarProductoModal'));
                modificarProductoModal.hide();

                // Recarga la lista de productos
                cargarProductos();
            } catch (error) {
                console.error('Error al guardar cambios en el producto', error);
                // Puedes agregar un mensaje de error o manejar la situación de otra manera
            }
        });
    });
})();