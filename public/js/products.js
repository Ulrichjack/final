import { addToCart } from './add-to-cart.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des éléments de filtrage
    const categoryFilter = document.getElementById('category-filter');
    const subcategoryFilter = document.getElementById('subcategory-filter');
    const sortOrder = document.getElementById('sort-order');
    const productList = document.getElementById('product-list');  // Assure-toi que cet élément existe dans ton HTML

    // Vérifie si les éléments existent avant d'ajouter des écouteurs d'événements
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (subcategoryFilter) {
        subcategoryFilter.addEventListener('change', applyFilters);
    }
    if (sortOrder) {
        sortOrder.addEventListener('change', applyFilters);
    }

    // Charger les produits au chargement de la page
    fetchProducts();
    // Charger les filtres au démarrage
    loadFilters();

    // Fonction pour charger les produits
    function fetchProducts() {
        fetch('/api/products') // Remplace l'URL par l'endpoint de ton API
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products && Array.isArray(data.products)) {
                const products = data.products;
                displayProducts(products); // Affiche les produits
            } else {
                console.error('Les produits sont absents ou la structure des données est incorrecte', data);
                alert('Erreur : produits non disponibles.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des produits:', error);
            alert('Erreur de chargement des produits. Veuillez réessayer plus tard.');
        });
    }

    // Fonction pour afficher les produits
    function displayProducts(products) {
        if (productList) {
            productList.innerHTML = ''; // Effacer les produits existants
            if (products.length === 0) {
                const noProductsMessage = document.createElement('p');
                noProductsMessage.textContent = 'Aucun produit trouvé.';
                productList.appendChild(noProductsMessage);
            } else {
                products.forEach(product => {
                    const productCard = createProductCard(product);
                    productList.appendChild(productCard);
                });
            }
        }
    }

    // Crée une carte produit
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const price = parseFloat(product.price);
        let stockMessage = 'En stock';
        if (product.stock <= 12) {
            stockMessage = `Plus que ${product.stock} en stock.`;
        }

        const imageName = product.image_name_1 ? product.image_name_1 : 'latour.jpg';

        const productLink = document.createElement('a');
        productLink.href = `/product-indiv?id=${product.id}`;
        productLink.className = 'product-link';

        let truncatedDescription = product.description;
        const descriptionLimit = 95;
        if (truncatedDescription.length > descriptionLimit) {
            truncatedDescription = truncatedDescription.substring(0, descriptionLimit) + '...';
        }

        productLink.innerHTML = `
            <img src="/images/${imageName}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="product-description">${truncatedDescription}</p>
            ${product.description.length > descriptionLimit ? '<span class="see-more">Voir plus</span><span class="see-less" style="display: none;">Voir moins</span>' : ''}
            <p class="price">€${price.toFixed(2)}</p>
            <p class="stock-message">${stockMessage}</p>
        `;

        productCard.appendChild(productLink);

        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart-btn';
        addButton.dataset.id = product.id;
        addButton.dataset.name = product.name;
        addButton.dataset.price = price;
        addButton.textContent = 'Ajouter au panier';
        productCard.appendChild(addButton);

        addButton.addEventListener('click', addToCart);

        const seeMore = productLink.querySelector('.see-more');
        const seeLess = productLink.querySelector('.see-less');

        if (seeMore) {
            seeMore.addEventListener('click', (event) => {
                event.preventDefault();
                productLink.querySelector('.product-description').textContent = product.description;
                seeMore.style.display = 'none';
                seeLess.style.display = 'inline';
            });
        }

        if (seeLess) {
            seeLess.addEventListener('click', (event) => {
                event.preventDefault();
                productLink.querySelector('.product-description').textContent = truncatedDescription;
                seeMore.style.display = 'inline';
                seeLess.style.display = 'none';
            });
        }

        return productCard;
    }

    // Charger les catégories et sous-catégories pour le filtrage
    function loadFilters() {
        fetch('/api/products/categories')
            .then(response => response.json())
            .then(data => {
                if (categoryFilter) {
                    data.categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.categories_id;
                        option.textContent = category.categories_name;
                        categoryFilter.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Erreur lors du chargement des catégories:', error));

        fetch('/api/products/subcategories')
            .then(response => response.json())
            .then(data => {
                if (subcategoryFilter) {
                    data.subcategories.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory.subcategory_id;
                        option.textContent = subcategory.subcategory_name;
                        subcategoryFilter.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Erreur lors du chargement des sous-catégories:', error));
    }

    // Appliquer les filtres
    function applyFilters() {
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        const selectedSubcategory = subcategoryFilter ? subcategoryFilter.value : '';
        const selectedSortOrder = sortOrder ? sortOrder.value : '';

        let url = '/api/products?';

        if (selectedCategory) {
            url += `category=${selectedCategory}&`;
        }
        if (selectedSubcategory) {
            url += `subcategory=${selectedSubcategory}&`;
        }
        if (selectedSortOrder) {
            url += `sort=${selectedSortOrder}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.products);
            })
            .catch(error => console.error('Erreur lors du filtrage des produits:', error));
    }
});
