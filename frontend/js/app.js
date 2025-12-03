const API_BASE = 'http://localhost:8080/api';

// Auth Header Helper
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    const auth = localStorage.getItem('auth');
    if (auth) {
        headers['Authorization'] = `Basic ${auth}`;
    }
    return headers;
}

// Navigation
function showSection(sectionId) {
    document.getElementById('invoices-section').style.display = sectionId === 'invoices' ? 'block' : 'none';
    document.getElementById('products-section').style.display = sectionId === 'products' ? 'block' : 'none';
    document.getElementById('settings-section').style.display = sectionId === 'settings' ? 'block' : 'none';

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Highlight active (simplified logic)

    if (sectionId === 'invoices') loadInvoices();
    if (sectionId === 'products') loadProducts();
}

function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'index.html';
}

// Invoices
async function loadInvoices() {
    try {
        const res = await fetch(`${API_BASE}/invoices`, { headers: getHeaders() });
        const invoices = await res.json();
        const tbody = document.getElementById('invoices-table-body');
        tbody.innerHTML = '';
        invoices.forEach(inv => {
            const row = `<tr>
                <td>${inv.sequential || 'Pendiente'}</td>
                <td>${inv.customerName}</td>
                <td>${new Date(inv.issueDate).toLocaleDateString()}</td>
                <td>$${inv.total}</td>
                <td><span class="status-badge status-authorized">${inv.sriStatus}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (e) {
        console.error(e);
    }
}

function showNewInvoice() {
    document.getElementById('invoice-list').style.display = 'none';
    document.getElementById('new-invoice-form').style.display = 'block';
}

function cancelInvoice() {
    document.getElementById('invoice-list').style.display = 'block';
    document.getElementById('new-invoice-form').style.display = 'none';
}

let globalProducts = [];

// Products
async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
        globalProducts = await res.json();
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '';
        globalProducts.forEach(p => {
            const row = `<tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>$${p.unitPrice}</td>
                <td>${p.taxType}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (e) {
        console.error(e);
    }
}

// ... (keep showNewProduct, cancelProduct, saveProduct)

// Invoice Creation Logic
let details = [];

function addDetailRow() {
    const tbody = document.getElementById('details-body');

    let options = '<option value="">Seleccione Producto</option>';
    globalProducts.forEach(p => {
        options += `<option value="${p.id}" data-price="${p.unitPrice}">${p.name}</option>`;
    });

    const row = `<tr>
        <td>
            <select class="form-control" onchange="updatePrice(this)">
                ${options}
            </select>
        </td>
        <td><input type="number" class="form-control" value="1" onchange="calcRowTotal(this)"></td>
        <td><input type="number" class="form-control" value="0.00" readonly></td>
        <td>$0.00</td>
        <td><button class="btn btn-danger" onclick="removeRow(this)">X</button></td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
}

function updatePrice(select) {
    const price = select.options[select.selectedIndex].dataset.price || 0;
    const row = select.closest('tr');
    row.querySelectorAll('input')[1].value = price; // Update Unit Price input
    calcRowTotal(select);
}

function calcRowTotal(el) {
    const row = el.closest('tr');
    const inputs = row.querySelectorAll('input');
    const qty = parseFloat(inputs[0].value) || 0;
    const price = parseFloat(inputs[1].value) || 0;
    const subtotal = qty * price;
    row.cells[3].innerText = '$' + subtotal.toFixed(2);
    calcTotal();
}

function removeRow(btn) {
    btn.closest('tr').remove();
    calcTotal();
}

function calcTotal() {
    let total = 0;
    document.querySelectorAll('#details-body tr').forEach(row => {
        const text = row.cells[3].innerText.replace('$', '');
        total += parseFloat(text) || 0;
    });
    document.getElementById('inv-total').innerText = total.toFixed(2);
}

async function saveInvoice() {
    // Gather details from the table
    const details = [];
    const rows = document.querySelectorAll('#details-body tr');
    rows.forEach(row => {
        const select = row.querySelector('select');
        const inputs = row.querySelectorAll('input');
        if (select && select.value) {
            details.push({
                product: { id: parseInt(select.value) },
                quantity: parseInt(inputs[0].value),
                unitPrice: parseFloat(inputs[1].value),
                subtotal: parseFloat(inputs[0].value) * parseFloat(inputs[1].value)
            });
        }
    });

    const invoice = {
        customerName: document.getElementById('inv-name').value,
        customerId: document.getElementById('inv-ruc').value,
        customerEmail: document.getElementById('inv-email').value,
        customerAddress: document.getElementById('inv-address').value,
        total: parseFloat(document.getElementById('inv-total').innerText),
        details: details
    };

    console.log("Sending invoice:", invoice);

    try {
        const res = await fetch(`${API_BASE}/invoices`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(invoice)
        });

        if (res.ok) {
            alert('Factura emitida y enviada al SRI');
            cancelInvoice();
            loadInvoices();
        } else {
            const errorText = await res.text();
            console.error("Error response:", errorText);
            alert('Error al emitir: ' + errorText);
        }
    } catch (e) {
        console.error("Fetch error:", e);
        alert('Error de conexión: ' + e.message);
    }
}

// Settings
function saveSignature() {
    // Mock saving signature
    alert('Configuración guardada (Simulación)');
}

// Init
loadInvoices();
