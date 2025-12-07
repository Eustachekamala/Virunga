document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api/v1/products';
    const productsTableBody = document.getElementById('products-table-body');
    const loadingSpinner = document.getElementById('loading-spinner');
    const emptyState = document.getElementById('empty-state');
    const totalProductsCount = document.getElementById('total-products-count');
    const lowStockCount = document.getElementById('low-stock-count');

    // Fetch Products
    async function fetchProducts() {
        showLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/allProducts`);
            if (response.ok) {
                const products = await response.json();
                renderProducts(products);
                updateStats(products);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            showLoading(false);
        }
    }

    // Render Products to Table
    function renderProducts(products) {
        productsTableBody.innerHTML = '';

        if (products.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${product.id}</td>
                <td>
                    <div style="font-weight: 500;">${product.name}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${product.description.substring(0, 30)}...</div>
                </td>
                <td><span class="badge">${product.typeProduct}</span></td>
                <td>$${product.price ? product.price.toFixed(2) : '0.00'}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="icon-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn" title="Delete" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash" style="color: var(--danger);"></i></button>
                </td>
            `;
            productsTableBody.appendChild(tr);
        });
    }

    // Update Stats
    function updateStats(products) {
        totalProductsCount.innerText = products.length;
        // Mock low stock logic -> quantity < 5
        const lowStock = products.filter(p => p.quantity < 5).length;
        lowStockCount.innerText = lowStock;
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingSpinner.classList.remove('hidden');
            productsTableBody.innerHTML = '';
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }

    // Modal Logic
    const modal = document.getElementById('productModal');
    const btn = document.getElementById('addProductBtn');
    const span = document.getElementsByClassName('close-modal')[0];

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Add Product Form
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Convert to DTO/JSON if backend expects parameters (ProductDTO is typically DTO)
        // Controller expects @ModelAttribute ProductDTO, so FormData should work if content-type is multipart/form-data
        // The fetch default for body: formData sends multipart automatically.

        try {
            const response = await fetch(`${API_BASE_URL}/insert`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Product added successfully!');
                modal.style.display = "none";
                form.reset();
                fetchProducts();
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Initial Load
    fetchProducts();
});

// Delete function needs to be global to be called from onclick
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`/api/v1/products/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // refresh
            location.reload();
        } else {
            alert('Failed to delete product');
        }
    } catch (e) {
        console.error(e);
    }
}
