// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

    const form = document.querySelector('.needs-validation');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;

            // Crear un objeto con los datos
            const nuevaFamilia = {
                id: null,
                Nombre: nombre,
            };
            // Guardar el objeto en la base de datos
            try {
                const docRef = await addDoc(collection(db, "Familias"), nuevaFamilia);
                console.log("Familia creada con el id: ", docRef.id);
                window.location.href = 'crearfamilia.html';
                // Actualizar el documento recién creado con el id generado
                await updateDoc(docRef, { id: docRef.id });
                console.log("Documento actualizado con el id: ", docRef.id);
            } catch (e) {
                console.error("Error al añadir Familia: ", e);
            }
        }

        form.classList.add('was-validated');
    }, false);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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