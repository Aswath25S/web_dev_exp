// ===== Menu Toggle =====
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-menu');

toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
})

// ===== Initial Load =====

async function init() {
    populateGenreSelect();
    const products = await getProducts();
    renderProducts(products);
}

init()

// ===== Product Fetching =====

async function getProducts(filters = {}) {
    console.log(filters)
    const queryParams = new URLSearchParams(filters)
    const res = await fetch(`/api/products?${queryParams}`);
    const result = await res.json()
    console.log(result)
    return await result;
}

// ===== Product Rendering =====

function renderProducts(products) {
    const albumsContainer = document.getElementById('products-container');
    const cards = products.map((album) => {
        return `
        <div class="product-card">
        <img src="./images/${album.image}" alt="${album.title}">
        <h2>${album.title}</h2>
        <h3>${album.artist}</h3>
        <p>$${album.price}</p>
        <button class="add-btn">Add to Cart</button>
        <p class="genre-label">${album.genre}</p>
      </div>`
    }).join('')
    albumsContainer.innerHTML = cards
}

// ===== Genre Dropdown =====

async function populateGenreSelect() {
    const res = await fetch('/api/products/genres');
    const genres = await res.json();
    const select = document.getElementById('genre-select');

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option)
    });
}

// ===== Filter Handling =====

async function applySearchFilter() {
    const search = document.getElementById('search-input').value.trim()
    const filters = {}
    if (search) {
        filters.search = search
    }
    const products = await getProducts(filters)
    renderProducts(products)
}

document.getElementById('genre-select').addEventListener('change', async (e) => {
    const genre = e.target.value
    const products = await getProducts(genre ? { genre } : {})
    renderProducts(products)
})

document.getElementById('search-input').addEventListener('input', async(e) => {
    applySearchFilter();
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    applySearchFilter();
})