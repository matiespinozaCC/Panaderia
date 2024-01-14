// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

(() => {
    'use strict'

    const firebaseConfig = {
        apiKey: "AIzaSyCRIuomfckaGnZjhcE8hHyRVFK_6t4qIzg",
        authDomain: "panaderia-d59f9.firebaseapp.com",
        projectId: "panaderia-d59f9",
        storageBucket: "panaderia-d59f9.appspot.com",
        messagingSenderId: "201059231911",
        appId: "1:201059231911:web:7f805183b61ca152a75382"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const form = document.querySelector('.needs-validation');
    const familiaSelect = document.getElementById('familia');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;
            const sku = parseInt(document.getElementById('sku').value);
            const barra = parseInt(document.getElementById('barra').value);
            const valorcompra = parseInt(document.getElementById('valorcompra').value);
            const valorventa = parseInt(document.getElementById('valorventa').value);
            const stock = parseInt(document.getElementById('stock').value);
            const stockcritico = parseInt(document.getElementById('stockcritico').value);
            const familia = document.getElementById('familia').value;

            // Crear un objeto con los datos
            const nuevoProducto = {
                id: null,
                Nombre: nombre,
                Sku: sku,
                Barra: barra,
                ValorCompra: valorcompra,
                ValorVenta: valorventa,
                Stock: stock,
                StockCritico: stockcritico,
                Familia: familia
            };
            // Guardar el objeto en la base de datos
            try {
                const docRef = await addDoc(collection(db, "Productos"), nuevoProducto);
                console.log("Producto creado con el id: ", docRef.id);
                window.location.href = 'crearproducto.html';
                // Actualizar el documento recién creado con el id generado
                await updateDoc(docRef, { id: docRef.id });
                console.log("Documento actualizado con el id: ", docRef.id);
            } catch (e) {
                console.error("Error al añadir Producto: ", e);
            }
        }

        form.classList.add('was-validated');
    }, false);

    // Obtener las opciones de Familias desde Firebase y agregarlas al select
    const cargarFamilias = async () => {
        try {
            const familiasSnapshot = await getDocs(collection(db, 'Familias'));
            const familias = familiasSnapshot.docs.map(doc => doc.data());

            familias.forEach(familia => {
                const option = document.createElement('option');
                option.value = familia.Nombre; // Ajusta esto según tu estructura de datos
                option.textContent = familia.Nombre;
                familiaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar familias desde Firebase: ", error);
        }
    };

    cargarFamilias(); // Llamada para cargar las familias al cargar la página



    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('.needs-validation');

        form.addEventListener('submit', async event => {
            // Código para el envío del formulario
        });

        // Obtener todos los elementos de formulario que necesitan validación
        const formElements = form.elements;

        // Iterar sobre los elementos y agregar eventos de escucha
        Array.from(formElements).forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                element.addEventListener('input', function () {
                    validateField(element);
                });
                element.addEventListener('change', function () {
                    validateField(element);
                });
            }
        });

        function validateField(element) {
            if (!element.checkValidity()) {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
            } else {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
            }
        }
    });
})()
