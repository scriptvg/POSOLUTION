// Definición de usuarios y sus permisos
const users = {
    cajero: { password: "cajero123", modules: ["sales"], name: "Carlos (Cajero)" },
    vendedor: { password: "vendedor123", modules: ["sales", "customers"], name: "Valeria (Vendedora)" },
    contador: { password: "contador123", modules: ["invoices", "reports"], name: "Carla (Contadora)" },
    administrador: { password: "admin123", modules: ["inventory", "sales", "invoices", "customers", "reports"], name: "Ana (Administradora)" },
    gerente: { password: "gerente123", modules: ["inventory", "sales", "invoices", "reports"], name: "Gustavo (Gerente)" }
};

let currentUser = null;

// Función para iniciar sesión
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        document.getElementById('userInfo').textContent = `Usuario: ${users[currentUser].name}`;
        setupTabs();
        loadAllData();
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
});

// Función para configurar las pestañas según los permisos del usuario
function setupTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';
    const userModules = users[currentUser].modules;
    userModules.forEach(module => {
        const tab = document.createElement('button');
        tab.className = 'tab';
        tab.textContent = module.charAt(0).toUpperCase() + module.slice(1);
        tab.setAttribute('data-tab', module);
        tab.addEventListener('click', () => switchTab(module));
        tabsContainer.appendChild(tab);
    });
    switchTab(userModules[0]);
}

// Función para cambiar entre pestañas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('animate__fadeIn');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.getElementById(tabId);
    activeTab.classList.add('active');
    activeTab.classList.add('animate__animated', 'animate__fadeIn');
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
}

// Función para cargar todos los datos
async function loadAllData() {
    await loadProducts();
    await loadInvoices();
    await loadCustomers();
    renderAvailableProductsTable();
}

// Funciones para manejar el almacenamiento local

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Función para cargar productos
async function loadProducts() {
    try {
        let products = loadData('products');
        if (!products) {
            // Si no hay productos en el almacenamiento local, carga datos de ejemplo
            products = [
                { id: 1, name: "Producto 1", price: 1000, stock: 10, category: "Categoría 1", barcode: "123456" },
                { id: 2, name: "Producto 2", price: 2000, stock: 20, category: "Categoría 2", barcode: "234567" }
            ];
            saveData('products', products);
        }
        console.log('Productos cargados:', products);
        renderProductTable(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para cargar facturas
async function loadInvoices() {
    try {
        let invoices = loadData('invoices');
        if (!invoices) {
            // Si no hay facturas en el almacenamiento local, carga datos de ejemplo
            invoices = [
                { id: 1, customer: "Cliente 1", total: 5000, date: "2023-05-01", status: "Pagada" },
                { id: 2, customer: "Cliente 2", total: 7500, date: "2023-05-02", status: "Pendiente" }
            ];
            saveData('invoices', invoices);
        }
        console.log('Facturas cargadas:', invoices);
        renderInvoicesTable(invoices);
    } catch (error) {
        console.error('Error al cargar facturas:', error);
    }
}

// Función para cargar clientes
async function loadCustomers() {
    try {
        let customers = loadData('customers');
        if (!customers) {
            // Si no hay clientes en el almacenamiento local, carga datos de ejemplo
            customers = [
                { id: 1, name: "Cliente 1", email: "cliente1@example.com", phone: "1234567890" },
                { id: 2, name: "Cliente 2", email: "cliente2@example.com", phone: "0987654321" }
            ];
            saveData('customers', customers);
        }
        console.log('Clientes cargados:', customers);
        renderCustomersTable(customers);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Función para renderizar la tabla de productos
function renderProductTable(products) {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>₡${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.barcode}</td>
            <td>
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
    });
}

// Función para renderizar la tabla de facturas
function renderInvoicesTable(invoices) {
    const tableBody = document.querySelector('#invoicesTable tbody');
    tableBody.innerHTML = '';
    invoices.forEach(invoice => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.customer}</td>
            <td>₡${invoice.total.toFixed(2)}</td>
            <td>${invoice.date}</td>
            <td>${invoice.status}</td>
            <td>
                <button onclick="viewInvoice(${invoice.id})">Ver</button>
                <button onclick="generateElectronicInvoice(${invoice.id})">Generar Factura Electrónica</button>
            </td>
        `;
    });
}

// Función para renderizar la tabla de clientes
function renderCustomersTable(customers) {
    const tableBody = document.querySelector('#customersTable tbody');
    tableBody.innerHTML = '';
    customers.forEach(customer => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <button onclick="editCustomer(${customer.id})">Editar</button>
                <button onclick="deleteCustomer(${customer.id})">Eliminar</button>
            </td>
        `;
    });
}

// Función para renderizar la tabla de productos disponibles para venta
function renderAvailableProductsTable() {
    const products = loadData('products');
    const tableBody = document.querySelector('#availableProductsTable tbody');
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>₡${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td><button onclick="addToCart(${product.id})">Agregar al carrito</button></td>
        `;
    });
}

// Funciones para el carrito de compras
let cart = [];

function addToCart(productId) {
    const products = loadData('products');
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        product.stock--;
        saveData('products', products);
        renderCart();
        renderAvailableProductsTable();
        showNotification('Producto agregado al carrito', 'success');
    } else {
        showNotification('Producto no disponible', 'error');
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-item-quantity">
                <button onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
            </div>
            <span>₡${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function updateCartItemQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    const products = loadData('products');
    const product = products.find(p => p.id === productId);

    if (cartItem) {
        if (change > 0 && product.stock > 0) {
            cartItem.quantity += change;
            product.stock--;
        } else if (change < 0 && cartItem.quantity > 1) {
            cartItem.quantity += change;
            product.stock++;
        } else if (change < 0 && cartItem.quantity === 1) {
            cart = cart.filter(item => item.id !== productId);
            product.stock++;
        }

        saveData('products', products);
        renderCart();
        renderAvailableProductsTable();
    }
}

// Función para finalizar la compra
document.getElementById('checkoutButton').addEventListener('click', finalizePurchase);

function finalizePurchase() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }

    const invoices = loadData('invoices') || [];
    const newInvoice = {
        id: invoices.length + 1,
        customer: "Cliente de mostrador",
        total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        date: new Date().toISOString().split('T')[0],
        status: "Pagada",
        items: cart.map(item => ({ ...item }))
    };

    invoices.push(newInvoice);
    saveData('invoices', invoices);

    cart = [];
    renderCart();
    renderAvailableProductsTable();
    renderInvoicesTable(invoices);

    showNotification('Compra finalizada con éxito', 'success');
}

// Función para generar factura electrónica
function generateElectronicInvoice(invoiceId) {
    // Aquí iría la lógica para generar la factura electrónica
    // Por ahora, solo mostraremos una notificación
    showNotification(`Factura electrónica generada para la factura #${invoiceId}`, 'success');
}

// Gestión de impuestos
document.getElementById('addTaxButton').addEventListener('click', addTax);

function addTax() {
    const taxName = document.getElementById('taxName').value;
    const taxRate = document.getElementById('taxRate').value;
    if (taxName && taxRate) {
        const taxes = loadData('taxes') || [];
        taxes.push({ name: taxName, rate: parseFloat(taxRate) });
        saveData('taxes', taxes);
        renderTaxesTable();
        document.getElementById('taxName').value = '';
        document.getElementById('taxRate').value = '';
        showNotification('Impuesto agregado correctamente', 'success');
    } else {
        showNotification('Por favor, complete todos los campos', 'error');
    }
}

function renderTaxesTable() {
    const taxes = loadData('taxes') || [];
    const taxesTable = document.querySelector('#taxesTable tbody');
    taxesTable.innerHTML = '';
    taxes.forEach((tax, index) => {
        const row = taxesTable.insertRow();
        row.innerHTML = `
            <td>${tax.name}</td>
            <td>${tax.rate}%</td>
            <td class="tax-actions">
                <button onclick="editTax(${index})">Editar</button>
                <button onclick="deleteTax(${index})">Eliminar</button>
            </td>
        `;
    });
}

function editTax(index) {
    const taxes = loadData('taxes') || [];
    const tax = taxes[index];
    document.getElementById('taxName').value = tax.name;
    document.getElementById('taxRate').value = tax.rate;
    taxes.splice(index, 1);
    saveData('taxes', taxes);
    renderTaxesTable();
}

function deleteTax(index) {
    if (confirm('¿Está seguro de que desea eliminar este impuesto?')) {
        const taxes = loadData('taxes') || [];
        taxes.splice(index, 1);
        saveData('taxes', taxes);
        renderTaxesTable();
        showNotification('Impuesto eliminado correctamente', 'success');
    }
}

// Gestión de proveedores
document.getElementById('addSupplierButton').addEventListener('click', addSupplier);

function addSupplier() {
    const supplierName = prompt("Ingrese el nombre del proveedor:");
    const supplierContact = prompt("Ingrese el nombre del contacto:");
    const supplierPhone = prompt("Ingrese el teléfono del proveedor:");
    const supplierEmail = prompt("Ingrese el email del proveedor:");

    if (supplierName && supplierContact && supplierPhone && supplierEmail) {
        const suppliers = loadData('suppliers') || [];
        suppliers.push({
            name: supplierName,
            contact: supplierContact,
            phone: supplierPhone,
            email: supplierEmail
        });
        saveData('suppliers', suppliers);
        renderSuppliersTable();
        showNotification('Proveedor agregado correctamente', 'success');
    } else {
        showNotification('Por favor, complete todos los campos', 'error');
    }
}

function renderSuppliersTable() {
    const suppliers = loadData('suppliers') || [];
    const suppliersTable = document.querySelector('#suppliersTable tbody');
    suppliersTable.innerHTML = '';
    suppliers.forEach((supplier, index) => {
        const row = suppliersTable.insertRow();
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.email}</td>
            <td class="supplier-actions">
                <button onclick="editSupplier(${index})">Editar</button>
                <button onclick="deleteSupplier(${index})">Eliminar</button>
            </td>
        `;
    });
}

function editSupplier(index) {
    const suppliers = loadData('suppliers') || [];
    const supplier = suppliers[index];
    const newName = prompt("Ingrese el nuevo nombre del proveedor:", supplier.name);
    const newContact = prompt("Ingrese el nuevo nombre del contacto:", supplier.contact);
    const newPhone = prompt("Ingrese el nuevo teléfono del proveedor:", supplier.phone);
    const newEmail = prompt("Ingrese el nuevo email del proveedor:", supplier.email);

    if (newName && newContact && newPhone && newEmail) {
        suppliers[index] = {
            name: newName,
            contact: newContact,
            phone: newPhone,
            email: newEmail
        };
        saveData('suppliers', suppliers);
        renderSuppliersTable();
        showNotification('Proveedor actualizado correctamente', 'success');
    } else {
        showNotification('Por favor, complete todos los campos', 'error');
    }
}

function deleteSupplier(index) {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
        const suppliers = loadData('suppliers') || [];
        suppliers.splice(index, 1);
        saveData('suppliers', suppliers);
        renderSuppliersTable();
        showNotification('Proveedor eliminado correctamente', 'success');
    }
}

// Reportes con gráficos
document.getElementById('generateReportButton').addEventListener('click', generateReport);

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    let reportData;
    switch (reportType) {
        case 'sales':
            reportData = generateSalesReport(startDate, endDate);
            break;
        case 'inventory':
            reportData = generateInventoryReport();
            break;
        case 'customers':
            reportData = generateCustomersReport();
            break;
        case 'taxes':
            reportData = generateTaxReport();
            break;
    }

    renderReport(reportType, reportData);
}

function renderReport(type, data) {
    const reportResult = document.getElementById('reportResult');
    let html = `<h3>Reporte de ${type === 'sales' ? 'Ventas' : type === 'inventory' ? 'Inventario' : type === 'customers' ? 'Clientes' : 'Impuestos'}</h3>`;

    switch (type) {
        case 'sales':
            html += `
                <p>Total de ventas: ₡${data.total.toFixed(2)}</p>
                <p>Número de transacciones: ${data.transactions}</p>
                <h4>Top 5 productos más vendidos:</h4>
                <ul>
                    ${data.topProducts.map(product => `<li>${product.name}: ${product.quantity} unidades</li>`).join('')}
                </ul>
            `;
            renderSalesChart(data);
            break;
        case 'inventory':
            html += `
                <p>Total de productos: ${data.totalProducts}</p>
                <p>Valor total del inventario: ₡${data.totalValue.toFixed(2)}</p>
                <h4>Productos con bajo stock:</h4>
                <ul>
                    ${data.lowStock.map(product => `<li>${product.name}: ${product.stock} unidades</li>`).join('')}
                </ul>
            `;
            renderInventoryChart(data);
            break;
        case 'customers':
            html += `
                <p>Total de clientes: ${data.totalCustomers}</p>
                <h4>Top 5 clientes por compras:</h4>
                <ul>
                    ${data.topCustomers.map(customer => `<li>${customer.name}: ₡${customer.totalPurchases.toFixed(2)}</li>`).join('')}
                </ul>
            `;
            renderCustomersChart(data);
            break;
        case 'taxes':
            html += `
                <p>Total de impuestos recaudados: ₡${data.totalTaxes.toFixed(2)}</p>
                <h4>Desglose por tipo de impuesto:</h4>
                <ul>
                    ${Object.entries(data.taxBreakdown).map(([tax, amount]) => `<li>${tax}: ₡${amount.toFixed(2)}</li>`).join('')}
                </ul>
            `;
            renderTaxesChart(data);
            break;
    }

    reportResult.innerHTML = html;
}

function renderSalesChart(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.topProducts.map(product => product.name),
            datasets: [{
                label: 'Unidades vendidas',
                data: data.topProducts.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderInventoryChart(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.lowStock.map(product => product.name),
            datasets: [{
                data: data.lowStock.map(product => product.stock),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Productos con bajo stock'
                }
            }
        }
    });
}

function renderCustomersChart(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.topCustomers.map(customer => customer.name),
            datasets: [{
                label: 'Total de compras',
                data: data.topCustomers.map(customer => customer.totalPurchases),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderTaxesChart(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data.taxBreakdown),
            datasets: [{
                data: Object.values(data.taxBreakdown),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Desglose de impuestos recaudados'
                }
            }
        }
    });
}

// Funciones de generación de reportes
function generateSalesReport(startDate, endDate) {
    const invoices = loadData('invoices') || [];
    const filteredInvoices = invoices.filter(invoice => 
        invoice.date >= startDate && invoice.date <= endDate
    );

    const total = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const transactions = filteredInvoices.length;

    const productSales = {};
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            if (productSales[item.name]) {
                productSales[item.name] += item.quantity;
            } else {
                productSales[item.name] = item.quantity;
            }
        });
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));

    return { total, transactions, topProducts };
}

function generateInventoryReport() {
    const products = loadData('products') || [];
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const lowStock = products.filter(product => product.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

    return { totalProducts, totalValue, lowStock };
}

function generateCustomersReport() {
    const invoices = loadData('invoices') || [];
    const customers = loadData('customers') || [];
    const totalCustomers = customers.length;

    const customerPurchases = {};
    invoices.forEach(invoice => {
        if (customerPurchases[invoice.customer]) {
            customerPurchases[invoice.customer] += invoice.total;
        } else {
            customerPurchases[invoice.customer] = invoice.total;
        }
    });

    const topCustomers = Object.entries(customerPurchases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, totalPurchases]) => ({ name, totalPurchases }));

    return { totalCustomers, topCustomers };
}

function generateTaxReport() {
    const invoices = loadData('invoices') || [];
    const taxes = loadData('taxes') || [];

    const taxBreakdown = {};
    let totalTaxes = 0;

    taxes.forEach(tax => {
        taxBreakdown[tax.name] = 0;
    });

    invoices.forEach(invoice => {
        taxes.forEach(tax => {
            const taxAmount = invoice.total * (tax.rate / 100);
            taxBreakdown[tax.name] += taxAmount;
            totalTaxes += taxAmount;
        });
    });

    return { totalTaxes, taxBreakdown };
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.getElementById('notifications').appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderTaxesTable();
    renderSuppliersTable();
});
