document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('.lista-productos');
    const contadorCarrito = document.getElementById('contador-carrito');
    const itemsCarritoContainer = document.querySelector('.items-carrito');
    const btnPagar = document.getElementById('btn-pagar');

// Simulación de base de datos de usuarios registrados
let usuariosRegistrados = [];

// --- Persistencia simple en localStorage para usuarios y sesión ---
function saveUsersToStorage() {
    try { localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados || [])); } catch (e) { console.warn('No se pudo guardar usuarios en localStorage', e); }
}

function loadUsersFromStorage() {
    try {
        const raw = localStorage.getItem('usuarios');
        if (raw) usuariosRegistrados = JSON.parse(raw) || [];
    } catch (e) { console.warn('No se pudo leer usuarios desde localStorage', e); }
}

function saveCurrentUserToStorage(user) {
    try { localStorage.setItem('usuarioActual', JSON.stringify(user || null)); } catch (e) { console.warn('No se pudo guardar usuarioActual', e); }
}

function loadCurrentUserFromStorage() {
    try {
        const raw = localStorage.getItem('usuarioActual');
        return raw ? JSON.parse(raw) : null;
    } catch (e) { console.warn('No se pudo leer usuarioActual', e); return null; }
}

// Cargar usuarios y sesión (si existen)
loadUsersFromStorage();
let usuarioActual = loadCurrentUserFromStorage();

// Persistencia para códigos de ticket y generación de códigos únicos
function loadTicketCodesFromStorage() {
    try {
        const raw = localStorage.getItem('ticketCodes');
        return raw ? JSON.parse(raw) : [];
    } catch (e) { console.warn('No se pudo leer ticketCodes desde localStorage', e); return []; }
}

function saveTicketCodesToStorage(codes) {
    try { localStorage.setItem('ticketCodes', JSON.stringify(codes || [])); } catch (e) { console.warn('No se pudo guardar ticketCodes en localStorage', e); }
}

let ticketCodes = loadTicketCodesFromStorage();

function generateUniqueTicketCode() {
    // Genera un código numérico de 8 dígitos y lo asegura único verificando ticketCodes
    let attempts = 0;
    while (attempts < 10) {
        const code = Math.floor(10000000 + Math.random() * 90000000).toString();
        if (!ticketCodes.find(t => t.code === code)) {
            return code;
        }
        attempts++;
    }
    // Si por alguna razón colisiona muchas veces, usar timestamp truncado
    return (Date.now().toString().slice(-8)).padStart(8, '0');
}

// Simulación de base de datos de productos
let productos = [
    {
        id: 24,
        nombre: 'Procesador AMD Ryzen 9 7950X3D',
        precio: 12700,
        imagen: 'https://media.mipc.com.mx/catalog/product/r/y/ryzen_7950x3d_1_1.png?',
        descripcion: 'Frecuencia base de 4.2 GHz, frecuencia turbo de 5.7 GHz, 16 núcleos, Socket AM5, caché 128MB'
    },
    {
        id: 23,
        nombre: 'Unidad de Estado Solido ADATA Ultimate SU630 240GB',
        precio: 309,
        imagen: 'https://m.media-amazon.com/images/I/71U28L7qyzL._AC_UF894,1000_QL80_DpWeblab_.jpg',
        descripcion: 'SSD 2.5" SATA III, lectura 520 MB/s, escritura 450 MB/s'
    },
    {
        id: 21,
        nombre: 'Samsung Galaxy Watch 4 Classic',
        precio: 3150,
        imagen: 'https://devotouy.vtexassets.com/arquivos/ids/1550396-800-auto?v=638628821061800000&width=800&height=auto&aspect=true',
        descripcion: 'Pantalla 1.4", NFC, Bluetooth, compatible con Android'
    },
    {
        id: 12,
        nombre: 'Laptop Lenovo V14 G3 IAP',
        precio: 9200,
        imagen: 'https://cdn.homedepot.com.mx/productos/223675/223675-d.jpg',
        descripcion: 'Procesador Intel Core i3, RAM 16GB DDR4, SSD 1TB, Windows 11 Home'
    },
    {
        id: 7,
        nombre: 'Laptop HP 240 G104',
        precio: 6900,
        imagen: 'https/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/AL2Q6LT-3_T1732731848.png',
        descripcion: 'Procesador Intel Core i3 1315U, 8GB RAM, 512GB SSD, Windows 11 Home'
    },
    {
        id: 5,
        nombre: 'Teclado Mecánico RGB',
        precio: 1600,
        imagen: 'https://pcreathors.mx/assets/uploads/sw_tecladorkr65_5.png?1732219968.png?text=Teclado+Mecanico',
        descripcion: 'Teclado mecánico con retroiluminación RGB personalizable'
    },
    {
        id: 15,
        nombre: 'Smartphone Xiaomi Redmi 14C',
        precio: 2300,
        imagen: 'https://i02.appmifile.com/731_item_mx/16/10/2024/5d584c744ba18c57182e94f2df77704f.png',
        descripcion: 'Procesador Mediatek Helio G81 Ultra, 4GB RAM, 256GB almacenamiento, Android 14'
    },
    {
        id: 18,
        nombre: 'Smartphone OPPO Reno10 5G',
        precio: 6250,
        imagen: 'https://www.oppo.com/content/dam/oppo/common/mkt/v2-2/reno10-5g-en/specs/reno10-5g-860_720.png',
        descripcion: 'Procesador Mediatek Dimensity 7050, 8GB RAM, 256GB almacenamiento, cámara 64MP'
    }
];

// Validación de datos antes de agregarlos
function agregarProducto(id, nombre, precio, imagen, descripcion) {
    if (productos.some(producto => producto.id === id)) {
        console.log("El producto con este ID ya existe.");
        return;
    }

    productos.push({ id, nombre, precio, imagen, descripcion });
    console.log("Producto agregado correctamente.");
}


// Visualización de productos en consola
console.log(productos);

    let carrito = [];

    // Función para mostrar productos en el catálogo
    function mostrarProductos() {
        if (!productosContainer) return;
        productosContainer.innerHTML = ''; // Limpiar contenedor
        productos.forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.classList.add('producto');
            divProducto.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <p>${producto.descripcion}</p>
                <button class="btn-ver-detalles" data-id="${producto.id}">Ver Detalles</button>
            `;
            productosContainer.appendChild(divProducto);
        });

        // Añadir event listeners a los botones de ver detalles
        document.querySelectorAll('.btn-ver-detalles').forEach(button => {
            button.addEventListener('click', (e) => mostrarDetalleProducto(parseInt(e.target.dataset.id)));
        });

        // Se ha eliminado la lógica que añadía botones y listeners "Agregar al Carrito"
    }

    // Función para agregar un producto al carrito
    function agregarAlCarrito(event) {
        const productoId = parseInt(event.target.dataset.id);
        const productoSeleccionado = productos.find(p => p.id === productoId);

        if (productoSeleccionado) {
            const itemExistente = carrito.find(item => item.id === productoId);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ ...productoSeleccionado, cantidad: 1 });
            }
            actualizarCarrito();
            alert("Producto añadido al carrito");
        }
    }

    // Función para actualizar la visualización del carrito
    function actualizarCarrito() {
        // Actualizar contador
        if (contadorCarrito) {
            contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
        }

        if (!itemsCarritoContainer) return;

        itemsCarritoContainer.innerHTML = ''; // Limpiar contenedor

        if (carrito.length === 0) {
            itemsCarritoContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            if (btnPagar) btnPagar.disabled = true;
            return;
        }

        // Crear elementos del carrito con controles de cantidad
        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-carrito');

            // Información y foto
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('item-carrito-info');
            infoDiv.innerHTML = `
                <h4>${item.nombre}</h4>
                <p>$${item.precio.toFixed(2)} cada uno</p>
            `;

            const img = document.createElement('img');
            img.src = item.imagen || '';
            img.alt = item.nombre;

            // Controles: - , input, +
            const controlesDiv = document.createElement('div');
            controlesDiv.style.display = 'flex';
            controlesDiv.style.alignItems = 'center';
            controlesDiv.style.gap = '8px';

            const btnMenos = document.createElement('button');
            btnMenos.textContent = '-';
            btnMenos.style.padding = '4px 8px';
            btnMenos.dataset.id = item.id;

            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.min = '1';
            inputCantidad.value = item.cantidad;
            inputCantidad.style.width = '60px';
            inputCantidad.dataset.id = item.id;

            const btnMas = document.createElement('button');
            btnMas.textContent = '+';
            btnMas.style.padding = '4px 8px';
            btnMas.dataset.id = item.id;

            controlesDiv.appendChild(btnMenos);
            controlesDiv.appendChild(inputCantidad);
            controlesDiv.appendChild(btnMas);

            // Subtotal y eliminar
            const subtotal = document.createElement('div');
            subtotal.textContent = `$${(item.precio * item.cantidad).toFixed(2)}`;
            subtotal.style.minWidth = '100px';
            subtotal.style.textAlign = 'right';

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.classList.add('btn-eliminar');
            btnEliminar.dataset.id = item.id;

            // Montar la fila del item
            const left = document.createElement('div');
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.appendChild(img);
            left.appendChild(infoDiv);

            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.flexDirection = 'column';
            right.style.alignItems = 'flex-end';
            right.appendChild(subtotal);
            right.appendChild(btnEliminar);

            itemDiv.appendChild(left);
            itemDiv.appendChild(controlesDiv);
            itemDiv.appendChild(right);

            itemsCarritoContainer.appendChild(itemDiv);

            // Listeners
            btnMas.addEventListener('click', () => {
                const prodId = parseInt(btnMas.dataset.id);
                const found = carrito.find(i => i.id === prodId);
                if (found) {
                    found.cantidad++;
                    inputCantidad.value = found.cantidad;
                    subtotal.textContent = `$${(found.precio * found.cantidad).toFixed(2)}`;
                    actualizarCarrito();
                }
            });

            btnMenos.addEventListener('click', () => {
                const prodId = parseInt(btnMenos.dataset.id);
                const found = carrito.find(i => i.id === prodId);
                if (found) {
                    if (found.cantidad > 1) {
                        found.cantidad--;
                        inputCantidad.value = found.cantidad;
                        subtotal.textContent = `$${(found.precio * found.cantidad).toFixed(2)}`;
                        actualizarCarrito();
                    } else {
                        carrito = carrito.filter(i => i.id !== prodId);
                        actualizarCarrito();
                    }
                }
            });

            inputCantidad.addEventListener('change', (e) => {
                const prodId = parseInt(e.target.dataset.id);
                let valor = parseInt(e.target.value);
                if (isNaN(valor) || valor < 1) valor = 1;
                const found = carrito.find(i => i.id === prodId);
                if (found) {
                    found.cantidad = valor;
                    subtotal.textContent = `$${(found.precio * found.cantidad).toFixed(2)}`;
                    actualizarCarrito();
                }
            });

            btnEliminar.addEventListener('click', (e) => {
                const prodId = parseInt(e.target.dataset.id);
                carrito = carrito.filter(i => i.id !== prodId);
                actualizarCarrito();
            });
        });

        // Mostrar total
        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        // Opciones de facturación
        const facturacionDiv = document.createElement('div');
        facturacionDiv.style.marginTop = '1rem';
        facturacionDiv.style.padding = '8px 0';
        facturacionDiv.innerHTML = `
            <label style="display:flex;align-items:center;gap:8px;">
                <input type="checkbox" id="facturacion-checkbox">
                <span>Para facturación haga click aquí</span>
            </label>
            <div id="facturacion-form" style="display:none;margin-top:10px;border:1px solid #eee;padding:10px;border-radius:6px;">
                <label>Nombre completo / Razón social:<br><input type="text" id="fact-nombre" style="width:100%"></label>
                <label>RFC:<br><input type="text" id="fact-rfc" style="width:100%"></label>
                <label>Código postal:<br><input type="text" id="fact-cp" style="width:100%"></label>
                <label>Domicilio fiscal:<br><textarea id="fact-domicilio" style="width:100%"></textarea></label>
                <label>Uso de CFDI:<br>
                    <select id="fact-uso" style="width:100%">
                        <option value="">--Seleccionar uso de CFDI--</option>
                        <option value="G01">G01 - Adquisición de mercancías</option>
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="P01">P01 - Por definir</option>
                        <option value="I01">I01 - Construcciones</option>
                    </select>
                </label>
            </div>
        `;
        itemsCarritoContainer.appendChild(facturacionDiv);

        // Mostrar total
        const totalDiv = document.createElement('div');
        totalDiv.style.marginTop = '1rem';
        totalDiv.style.display = 'flex';
        totalDiv.style.justifyContent = 'space-between';
        totalDiv.style.alignItems = 'center';
        totalDiv.innerHTML = `<strong>Total:</strong> <span id="total-carrito">$${total.toFixed(2)}</span>`;
        itemsCarritoContainer.appendChild(totalDiv);

        // Listeners para el checkbox de facturación
        const chk = document.getElementById('facturacion-checkbox');
        const formFact = document.getElementById('facturacion-form');
        if (chk && formFact) {
            chk.addEventListener('change', (e) => {
                formFact.style.display = e.target.checked ? 'block' : 'none';
            });
        }

        if (btnPagar) btnPagar.disabled = carrito.length === 0;
    }

    // Función para mostrar la vista detallada de un producto
    function mostrarDetalleProducto(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (!producto) return;

        // Remover clase 'seleccionado' de cualquier otro producto
        document.querySelectorAll('.producto.seleccionado').forEach(p => p.classList.remove('seleccionado'));

        // Encontrar la tarjeta del producto clickeado en la lista principal y añadir la clase 'seleccionado'
        let clickedProductCard = null;
        if (productosContainer) { // Asegurarse que productosContainer está disponible
            const allProductCards = productosContainer.querySelectorAll('.producto');
            allProductCards.forEach(card => {
                const button = card.querySelector(`.btn-ver-detalles[data-id="${productoId}"]`);
                if (button) {
                    clickedProductCard = card;
                }
            });
        }

        if (clickedProductCard) {
            clickedProductCard.classList.add('seleccionado');
        }

        const detalleProductoContainer = document.getElementById('detalle-producto-content');
        if (!detalleProductoContainer) {
            console.error('Contenedor de detalle de producto no encontrado');
            return;
        }

        detalleProductoContainer.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 300px; margin-bottom: 20px;">
            <h2>${producto.nombre}</h2>
            <p class="precio">Precio: $${producto.precio.toFixed(2)}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion}</p>
            <button id="btn-volver-catalogo">Volver al Catálogo</button>
        `;

        // Ya no existe el botón "Agregar al Carrito" en la vista de detalle, por lo tanto se elimina su listener.

        // Event listener para el botón de volver al catálogo
        document.getElementById('btn-volver-catalogo').addEventListener('click', () => {
            document.getElementById('detalle-producto').style.display = 'none';
            document.getElementById('productos').style.display = 'block';
            // Remover clase 'seleccionado' de la tarjeta al volver (si aplica)
            document.querySelectorAll('.producto.seleccionado').forEach(p => p.classList.remove('seleccionado'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Ocultar otras secciones y mostrar la de detalle
        secciones.forEach(seccion => seccion.style.display = 'none');
        const seccionDetalle = document.getElementById('detalle-producto');
        if (seccionDetalle) seccionDetalle.style.display = 'block';
    }

    // Función para eliminar un item del carrito
    function eliminarDelCarrito(event) {
        const productoId = parseInt(event.target.dataset.id);
        carrito = carrito.filter(item => item.id !== productoId);
        actualizarCarrito();
    }

    // Navegación entre secciones
    const navLinks = document.querySelectorAll('nav ul li a');
    const secciones = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            secciones.forEach(seccion => {
                if (seccion.id === targetId) {
                    seccion.style.display = 'block';
                } else {
                    seccion.style.display = 'none';
                }
            });
            // Asegurarse que la sección de productos se muestre si es el target o por defecto
            if (targetId === 'productos' || !document.getElementById(targetId)){
                 if(document.getElementById('productos')) document.getElementById('productos').style.display = 'block';
            }
        });
    });

    // Mostrar productos al cargar la página
    mostrarProductos();
    actualizarCarrito(); // Para inicializar el contador y el estado del carrito

    // Lógica para el botón de pagar (simulación)
    if (btnPagar) {
        btnPagar.addEventListener('click', () => {
            if (carrito.length > 0) {
                // Simulación de flujo de compra con mensaje de confirmación
                const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2);
                const confirmacion = confirm(`Confirmar compra de ${carrito.reduce((acc, item) => acc + item.cantidad, 0)} item(s) por un total de $${totalCompra}. ¿Desea continuar?`);
                
                if (confirmacion) {
                    alert('¡Gracias por su compra! Su pedido ha sido procesado.');
                    generarTicketCompra();
                    carrito = []; // Vaciar carrito después del pago
                    actualizarCarrito();
                    // Volver a la sección de productos
                    secciones.forEach(seccion => seccion.style.display = 'none');
                    if(document.getElementById('productos')) document.getElementById('productos').style.display = 'block';
                } else {
                    alert('Compra cancelada.');
                }
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Función para descargar contenido como archivo TXT
    function descargarComoTXT(contenido, nombreArchivo) {
        const elemento = document.createElement('a');
        elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
        elemento.setAttribute('download', nombreArchivo);
        elemento.style.display = 'none';
        document.body.appendChild(elemento);
        elemento.click();
        document.body.removeChild(elemento);
    }

    // Función para generar y simular guardado de ticket
    function generarTicketCompra() {
        if (carrito.length === 0) {
            console.log("El carrito está vacío, no se genera ticket.");
            return;
        }

        // Generar código único de 8 dígitos
        const codigo = generateUniqueTicketCode();

        const compradorNombre = usuarioActual ? usuarioActual.nombre : 'Invitado';
        const compradorEmail = usuarioActual ? usuarioActual.email : 'N/A';

        let ticketContent = '============= TICKET DE COMPRA =============\n';
        ticketContent += `Código: ${codigo}\n`;
        ticketContent += `Tienda: EleComp\n`;
        ticketContent += `Comprador: ${compradorNombre} (${compradorEmail})\n`;
        ticketContent += `Fecha: ${new Date().toLocaleString()}\n`;
        ticketContent += '--------------------------------------------\n';
        ticketContent += 'Productos:\n';
        carrito.forEach(item => {
            ticketContent += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        ticketContent += '--------------------------------------------\n';

        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2);
        ticketContent += `TOTAL: $${total}\n`;
        ticketContent += '============================================\n';
        ticketContent += '¡Gracias por su compra en EleComp!\n';

        // Guardar el código en el historial local (para mantener unicidad futura)
        ticketCodes.push({ code: codigo, fecha: new Date().toISOString(), comprador: compradorEmail, total: parseFloat(total) });
        saveTicketCodesToStorage(ticketCodes);

        console.log('--- Contenido del Ticket ---');
        console.log(ticketContent);

        // Intentar leer datos de facturación (si el usuario marcó la casilla y el formulario existe)
        const chkFact = document.getElementById('facturacion-checkbox');
        const tieneFacturacion = chkFact ? chkFact.checked : false;
        let facturaContent = null;
        if (tieneFacturacion) {
            const nombreFact = (document.getElementById('fact-nombre') || {}).value || '';
            const rfcFact = (document.getElementById('fact-rfc') || {}).value || '';
            const cpFact = (document.getElementById('fact-cp') || {}).value || '';
            const domFact = (document.getElementById('fact-domicilio') || {}).value || '';
            const usoFact = (document.getElementById('fact-uso') || {}).value || '';

            // Construir contenido básico de factura (texto plano). Validaciones mínimas: nombre y RFC opcionales
            facturaContent = '============= FACTURA =============\n';
            facturaContent += `Código de factura: ${codigo}\n`;
            facturaContent += `Fecha: ${new Date().toLocaleString()}\n`;
            facturaContent += `Razón social / Nombre: ${nombreFact || compradorNombre}\n`;
            facturaContent += `RFC: ${rfcFact || 'N/A'}\n`;
            facturaContent += `Código postal: ${cpFact || 'N/A'}\n`;
            facturaContent += `Domicilio fiscal: ${domFact || 'N/A'}\n`;
            facturaContent += `Uso de CFDI: ${usoFact || 'N/A'}\n`;
            facturaContent += '-----------------------------------\n';
            facturaContent += 'Productos facturados:\n';
            carrito.forEach(item => {
                facturaContent += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
            });
            facturaContent += '-----------------------------------\n';
            facturaContent += `TOTAL: $${total}\n`;
            facturaContent += '===================================\n';
        }

        // Crear modal con el ticket (y factura si aplica)
        const existing = document.getElementById('ticket-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'ticket-overlay';
        overlay.innerHTML = `
            <div id="ticket-modal">
                <div id="ticket-header">
                    <div>
                        <h2>Ticket de Compra</h2>
                        <div style="font-size:0.95em;color:#555">Código: <strong>${codigo}</strong></div>
                    </div>
                    <button id="ticket-close" aria-label="Cerrar">✕</button>
                </div>
                <div id="ticket-body">
                    <pre id="ticket-pre">${ticketContent}</pre>
                    ${facturaContent ? ('<hr><pre id="factura-pre">' + facturaContent + '</pre>') : ''}
                </div>
                <div id="ticket-actions">
                    <button id="ticket-download">Descargar Ticket (.txt)</button>
                    ${facturaContent ? ('<button id="factura-download">Descargar Factura (.txt)</button>') : ''}
                    <button id="ticket-ok">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Descargar con nombre que incluye el código
        const btnDownload = document.getElementById('ticket-download');
        btnDownload.addEventListener('click', () => {
            descargarComoTXT(ticketContent, `ticket_${codigo}.txt`);
        });

        // Si existe factura, enlazar descarga también
        if (facturaContent) {
            const btnFact = document.getElementById('factura-download');
            if (btnFact) {
                btnFact.addEventListener('click', () => {
                    descargarComoTXT(facturaContent, `factura_${codigo}.txt`);
                });
            }
        }

        // Cerrar
        const cerrar = () => {
            const el = document.getElementById('ticket-overlay');
            if (el) el.remove();
        };
        document.getElementById('ticket-close').addEventListener('click', cerrar);
        document.getElementById('ticket-ok').addEventListener('click', cerrar);

        // Cerrar al hacer click fuera del modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cerrar();
        });
    }

    // Simulación de formularios de cuenta y admin (solo para mostrar/ocultar)
    // La lógica completa de usuarios y admin requeriría backend
    const seccionCuenta = document.getElementById('cuenta');
    const seccionAdmin = document.getElementById('admin');

    // Renderiza la sección 'Mi Cuenta' dependiendo de si hay una sesión activa
    function renderCuentaSection() {
        if (!seccionCuenta) return;

        if (usuarioActual) {
            seccionCuenta.innerHTML = `
                <h2>Mi Cuenta</h2>
                <div class="mi-cuenta">
                    <p><strong>Nombre:</strong> ${usuarioActual.nombre}</p>
                    <p><strong>Email:</strong> ${usuarioActual.email}</p>
                    <button id="btn-logout">Cerrar sesión</button>
                </div>
            `;

            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => {
                    usuarioActual = null;
                    saveCurrentUserToStorage(null);
                    renderCuentaSection();
                });
            }
        } else {
            // Mostrar formularios de login/registro
            seccionCuenta.innerHTML = `
                <h3>Iniciar Sesión</h3>
                <form id="form-login">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" name="login-email" required>
                    <label for="login-pass">Contraseña:</label>
                    <input type="password" id="login-pass" name="login-pass" required>
                    <button type="submit">Iniciar Sesión</button>
                </form>
                <h3>Crear Cuenta</h3>
                <form id="form-registro">
                    <label for="reg-nombre">Nombre:</label>
                    <input type="text" id="reg-nombre" name="reg-nombre" required>
                    <label for="reg-email">Email:</label>
                    <input type="email" id="reg-email" name="reg-email" required>
                    <label for="reg-pass">Contraseña:</label>
                    <input type="password" id="reg-pass" name="reg-pass" required>
                    <button type="submit">Registrarse</button>
                </form>
            `;

            // Event listeners para formularios de login y registro
            const formLogin = document.getElementById('form-login');
            if (formLogin) {
                formLogin.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('login-email').value.trim();
                    const pass = document.getElementById('login-pass').value;

                    const usuarioEncontrado = usuariosRegistrados.find(user => user.email === email && user.pass === pass);

                    if (usuarioEncontrado) {
                        usuarioActual = { nombre: usuarioEncontrado.nombre, email: usuarioEncontrado.email };
                        saveCurrentUserToStorage(usuarioActual);
                        alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre}!`);
                        renderCuentaSection();
                    } else {
                        const existeEmail = usuariosRegistrados.find(user => user.email === email);
                        if (existeEmail) {
                            alert('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
                        } else {
                            alert('Usuario no encontrado. Por favor, regístrate o verifica tus credenciales.');
                        }
                    }
                    formLogin.reset();
                });
            }

            const formRegistro = document.getElementById('form-registro');
            if (formRegistro) {
                formRegistro.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nombre = document.getElementById('reg-nombre').value.trim();
                    const email = document.getElementById('reg-email').value.trim();
                    const pass = document.getElementById('reg-pass').value;

                    if (usuariosRegistrados.find(user => user.email === email)) {
                        alert('Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.');
                        return;
                    }

                    const nuevoUsuario = { nombre, email, pass };
                    usuariosRegistrados.push(nuevoUsuario);
                    saveUsersToStorage();

                    // Loguear automáticamente tras registro
                    usuarioActual = { nombre: nuevoUsuario.nombre, email: nuevoUsuario.email };
                    saveCurrentUserToStorage(usuarioActual);

                    alert('¡Registro exitoso! Has sido autenticado.');
                    renderCuentaSection();
                    formRegistro.reset();
                });
            }
        }
    }

    // Inicializar la vista de cuenta
    renderCuentaSection();

    // Admin: panel protegido por contraseña simple
    // Guardar estado en localStorage para no pedir contraseña repetida
    function loadAdminAuth() {
        try { return localStorage.getItem('adminAuth') === 'true'; } catch (e) { return false; }
    }
    function saveAdminAuth(val) {
        try { localStorage.setItem('adminAuth', val ? 'true' : 'false'); } catch (e) { /* ignore */ }
    }

    let adminAuthenticated = loadAdminAuth();

    function renderAdminSection() {
        if (!seccionAdmin) return;

        if (!adminAuthenticated) {
            // Mostrar formulario de acceso
            seccionAdmin.innerHTML = `
                <h2>Acceso de Administrador</h2>
                <form id="form-admin-login">
                    <label for="admin-pass">Contraseña:</label>
                    <input type="password" id="admin-pass" name="admin-pass" required>
                    <button type="submit">Ingresar</button>
                    <p id="admin-message" style="color:red; display:none; margin-top:8px;"></p>
                </form>
            `;

            const formAdminLogin = document.getElementById('form-admin-login');
            const msg = document.getElementById('admin-message');
            if (formAdminLogin) {
                formAdminLogin.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const pass = document.getElementById('admin-pass').value;
                    if (pass === 'ADMIN') {
                        adminAuthenticated = true;
                        saveAdminAuth(true);
                        renderAdminSection(); // Mostrar panel
                        // Mostrar sección admin en navegación
                        secciones.forEach(seccion => seccion.style.display = (seccion.id === 'admin') ? 'block' : 'none');
                    } else {
                        if (msg) { msg.textContent = 'Contraseña incorrecta'; msg.style.display = 'block'; }
                    }
                    formAdminLogin.reset();
                });
            }
        } else {
            // Mostrar panel de administración (formulario de añadir producto)
            seccionAdmin.innerHTML = `
                <h2>Panel de Administración</h2>
                <h3>Añadir Nuevo Producto</h3>
                <form id="form-add-producto">
                    <label for="prod-nombre">Nombre del Producto:</label>
                    <input type="text" id="prod-nombre" name="prod-nombre" required>
                    <label for="prod-precio">Precio:</label>
                    <input type="number" id="prod-precio" name="prod-precio" step="0.01" required>
                    <label for="prod-imagen">URL de Imagen:</label>
                    <input type="text" id="prod-imagen" name="prod-imagen">
                    <label for="prod-desc">Descripción:</label>
                    <textarea id="prod-desc" name="prod-desc"></textarea>
                    <button type="submit">Añadir Producto</button>
                </form>
                <button id="btn-admin-logout" style="margin-top:12px;">Cerrar sesión de Admin</button>
            `;

            const formAddProducto = document.getElementById('form-add-producto');
            if (formAddProducto) {
                formAddProducto.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nombre = document.getElementById('prod-nombre').value;
                    const precio = parseFloat(document.getElementById('prod-precio').value);
                    const imagen = document.getElementById('prod-imagen').value || 'https://via.placeholder.com/200x150.png?text=Nuevo+Producto';
                    const descripcion = document.getElementById('prod-desc').value;

                    if (nombre && !isNaN(precio)) {
                        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
                        const nuevoProducto = { id: nuevoId, nombre, precio, imagen, descripcion };
                        productos.push(nuevoProducto);
                        mostrarProductos(); // Actualizar la vista del catálogo
                        alert(`Producto "${nombre}" añadido al catálogo.`);
                        console.log("Producto añadido (en memoria):", nuevoProducto);
                        formAddProducto.reset();
                    } else {
                        alert('Por favor, completa el nombre y el precio del producto.');
                    }
                });
            }

            const btnAdminLogout = document.getElementById('btn-admin-logout');
            if (btnAdminLogout) {
                btnAdminLogout.addEventListener('click', () => {
                    adminAuthenticated = false;
                    saveAdminAuth(false);
                    renderAdminSection();
                });
            }
        }
    }

    // Inicializar admin
    renderAdminSection();

// Función para generar y simular guardado de ticket (ahora muestra en modal en la página)
function generarTicketCompra() {
    if (carrito.length === 0) {
        console.log("El carrito está vacío, no se genera ticket.");
        return;
    }

    // Generar código único de 8 dígitos
    const codigo = generateUniqueTicketCode();

    const compradorNombre = usuarioActual ? usuarioActual.nombre : 'Invitado';
    const compradorEmail = usuarioActual ? usuarioActual.email : 'N/A';

    let ticketContent = '============= TICKET DE COMPRA =============\n';
    ticketContent += `Código: ${codigo}\n`;
    ticketContent += `Tienda: EleComp\n`;
    ticketContent += `Comprador: ${compradorNombre} (${compradorEmail})\n`;
    ticketContent += `Fecha: ${new Date().toLocaleString()}\n`;
    ticketContent += '--------------------------------------------\n';
    ticketContent += 'Productos:\n';
    carrito.forEach(item => {
        ticketContent += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    ticketContent += '--------------------------------------------\n';
    ticketContent += `TOTAL: $${total}\n`;
    ticketContent += '============================================\n';
    ticketContent += '¡Gracias por su compra en EleComp!\n';

    // Guardar el código en el historial local (para mantener unicidad futura)
    ticketCodes.push({ code: codigo, fecha: new Date().toISOString(), comprador: compradorEmail, total: parseFloat(total) });
    saveTicketCodesToStorage(ticketCodes);

    console.log('--- Contenido del Ticket ---');
    console.log(ticketContent);

    // Intentar leer datos de facturación (si el usuario marcó la casilla y el formulario existe)
    const chkFact = document.getElementById('facturacion-checkbox');
    const tieneFacturacion = chkFact ? chkFact.checked : false;
    let facturaContent = null;
    if (tieneFacturacion) {
        const nombreFact = (document.getElementById('fact-nombre') || {}).value || '';
        const rfcFact = (document.getElementById('fact-rfc') || {}).value || '';
        const cpFact = (document.getElementById('fact-cp') || {}).value || '';
        const domFact = (document.getElementById('fact-domicilio') || {}).value || '';
        const usoFact = (document.getElementById('fact-uso') || {}).value || '';

        // Construir contenido básico de factura (texto plano). Validaciones mínimas: nombre y RFC opcionales
        facturaContent = '============= FACTURA =============\n';
        facturaContent += `Código de factura: ${codigo}\n`;
        facturaContent += `Fecha: ${new Date().toLocaleString()}\n`;
        facturaContent += `Razón social / Nombre: ${nombreFact || compradorNombre}\n`;
        facturaContent += `RFC: ${rfcFact || 'N/A'}\n`;
        facturaContent += `Código postal: ${cpFact || 'N/A'}\n`;
        facturaContent += `Domicilio fiscal: ${domFact || 'N/A'}\n`;
        facturaContent += `Uso de CFDI: ${usoFact || 'N/A'}\n`;
        facturaContent += '-----------------------------------\n';
        facturaContent += 'Productos facturados:\n';
        carrito.forEach(item => {
            facturaContent += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        facturaContent += '-----------------------------------\n';
        facturaContent += `TOTAL: $${total}\n`;
        facturaContent += '===================================\n';
    }

    // Crear modal con el ticket (y factura si aplica)
    const existing = document.getElementById('ticket-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ticket-overlay';
    overlay.innerHTML = `
        <div id="ticket-modal">
            <div id="ticket-header">
                <div>
                    <h2>Ticket de Compra</h2>
                    <div style="font-size:0.95em;color:#555">Código: <strong>${codigo}</strong></div>
                </div>
                <button id="ticket-close" aria-label="Cerrar">✕</button>
            </div>
            <div id="ticket-body">
                <pre id="ticket-pre">${ticketContent}</pre>
                ${facturaContent ? ('<hr><pre id="factura-pre">' + facturaContent + '</pre>') : ''}
            </div>
            <div id="ticket-actions">
                <button id="ticket-download">Descargar Ticket (.txt)</button>
                ${facturaContent ? ('<button id="factura-download">Descargar Factura (.txt)</button>') : ''}
                <button id="ticket-ok">Aceptar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Descargar con nombre que incluye el código
    const btnDownload = document.getElementById('ticket-download');
    btnDownload.addEventListener('click', () => {
        descargarComoTXT(ticketContent, `ticket_${codigo}.txt`);
    });

    // Si existe factura, enlazar descarga también
    if (facturaContent) {
        const btnFact = document.getElementById('factura-download');
        if (btnFact) {
            btnFact.addEventListener('click', () => {
                descargarComoTXT(facturaContent, `factura_${codigo}.txt`);
            });
        }
    }

    // Cerrar
    const cerrar = () => {
        const el = document.getElementById('ticket-overlay');
        if (el) el.remove();
    };
    document.getElementById('ticket-close').addEventListener('click', cerrar);
    document.getElementById('ticket-ok').addEventListener('click', cerrar);

    // Cerrar al hacer click fuera del modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrar();
    });
}

});