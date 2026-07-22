// Estado inicial del inventario
let inventory = [
    { id: 1, nombre: "Laptop Pro 15", cantidad: 8, precio: 1200.00 },
    { id: 2, nombre: "Mouse Inalámbrico", cantidad: 3, precio: 25.50 },
    { id: 3, nombre: "Teclado Mecánico", cantidad: 12, precio: 85.00 }
];

// Elementos del DOM
const inventoryBody = document.getElementById('inventory-body');
const inventoryForm = document.getElementById('inventory-form');
const totalProductosEl = document.getElementById('total-productos');
const valorTotalEl = document.getElementById('valor-total');
const stockBajoEl = document.getElementById('stock-bajo');
const btnExportTxt = document.getElementById('btn-export-txt');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    render();
});

// Renderizar tabla y métricas
function render() {
    renderTable();
    updateMetrics();
}

function renderTable() {
    inventoryBody.innerHTML = '';
    inventory.forEach((item) => {
        const tr = document.createElement('tr');
        const subtotal = item.cantidad * item.precio;
        
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn danger" onclick="deleteItem(${item.id})">Eliminar</button>
            </td>
        `;
        inventoryBody.appendChild(tr);
    });
}

// Métricas de Análisis
function updateMetrics() {
    const totalQty = inventory.reduce((acc, curr) => acc + curr.cantidad, 0);
    const totalValue = inventory.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0);
    const lowStock = inventory.filter(item => item.cantidad < 5).length;

    totalProductosEl.textContent = totalQty;
    valorTotalEl.textContent = $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })};
    stockBajoEl.textContent = lowStock;
}

// Agregar producto
inventoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);

    const newItem = {
        id: inventory.length ? Math.max(...inventory.map(i => i.id)) + 1 : 1,
        nombre,
        cantidad,
        precio
    };

    inventory.push(newItem);
    inventoryForm.reset();
    render();
});

// Eliminar producto
function deleteItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    render();
}

// Generación y descarga del informe en .txt
btnExportTxt.addEventListener('click', () => {
    const fecha = new Date().toLocaleDateString('es-ES');
    const totalVal = inventory.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0);
    const totalQty = inventory.reduce((acc, curr) => acc + curr.cantidad, 0);
    const lowStockItems = inventory.filter(i => i.cantidad < 5);

    let reportContent = ==================================================\n;
    reportContent += `       INFORME Y ANÁLISIS DE INVENTARIO           \n`;
    reportContent += ==================================================\n;
    reportContent += Fecha del Reporte: ${fecha}\n\n;
    
    reportContent += --- RESUMEN DE ANÁLISIS ---\n;
    reportContent += Unidades Totales en Stock: ${totalQty}\n;
    reportContent += Valor Valorizado Total: $${totalVal.toFixed(2)}\n;
    reportContent += Productos con Alerta de Stock Bajo (<5): ${lowStockItems.length}\n\n;

    reportContent += --- DETALLE DE PRODUCTOS ---\n;
    inventory.forEach(item => {
        const sub = item.cantidad * item.precio;
        reportContent += ID: ${item.id} | ${item.nombre}\n;
        reportContent += `   Cantidad: ${item.cantidad} | Precio: $${item.precio.toFixed(2)} | Subtotal: $${sub.toFixed(2)}\n`;
    });

    if (lowStockItems.length > 0) {
        reportContent += \n--- ALERTAS DE REABASTECIMIENTO ---\n;
        lowStockItems.forEach(i => {
            reportContent += [CRÍTICO] ${i.nombre} - Solo quedan ${i.cantidad} unidades.\n;
        });
    }

    reportContent += \n==================================================\n;
    reportContent += Fin del reporte. Generado por Sistema de Inventario JS.;

    // Crear y descargar archivo .txt
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = Informe_Inventario_${new Date().toISOString().slice(0,10)}.txt;
    link.click();
    URL.revokeObjectURL(link.href);