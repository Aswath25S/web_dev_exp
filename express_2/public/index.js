const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.header-menu');

toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
})

async function init() {
    populateGenreSelect();
    const products = await getProducts();
    renderProducts(products);
}

init()

async function getProducts() {
    const res = await fetch('/api/products/');
    return await res.json();
}

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