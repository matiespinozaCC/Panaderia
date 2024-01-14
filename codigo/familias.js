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

    let familias;

    document.addEventListener('DOMContentLoaded', async function () {
        const familiasContainer = document.getElementById('familias-container');
        const inputBusqueda = document.getElementById('busqueda');

        // Obtener todos los familias desde Firebase
        const cargarFamilias = async () => {
            try {
                const familiasSnapshot = await getDocs(collection(db, 'Familias'));
                familias = familiasSnapshot.docs.map(doc => doc.data());

                // Mostrar los familias en tarjetas de Bootstrap
                mostrarFamilias(familias);
            } catch (error) {
                console.error("Error al cargar familias desde Firebase: ", error);
                return []
            }
        };

        cargarFamilias(); // Llamada para cargar los productos al cargar la página

        inputBusqueda.addEventListener('input', function () {
            filtrarFamilias(inputBusqueda.value.trim().toLowerCase());
        });

        function mostrarFamilias(familias) {
            familiasContainer.innerHTML = ''; // Limpiar el contenido anterior

            familias.forEach(familia => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-3');

                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${familia.Nombre}</h5>
                            <p class="card-text">ID: ${familia.id}</p>
                        </div>
                    </div>
                `;

                familiasContainer.appendChild(card);
            });
        }

        function filtrarFamilias(terminoBusqueda) {

            const familiasFiltrados = familias.filter(familia =>
                familia.Nombre.toLowerCase().includes(terminoBusqueda)
            );

            mostrarFamilias(familiasFiltrados);
        }
    });
})()
