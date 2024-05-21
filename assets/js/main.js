document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");
  const apiUrl = "https://fakestoreapi.com/products";
  const formAddProduct = document.getElementById("form-add-product");
  const formEditProduct = document.getElementById("form-edit-product");
  const editModal = document.getElementById("edit-modal");
  const closeModal = document.querySelector(".close-btn");

  let editProductId = null;

  /* nossa função de buscar todos os produtos */
  async function fetchProducts() {
    const response = await fetch(`${apiUrl}?limit=12`);
    const products = await response.json();
    displayProducts(products);
  }

  function displayProducts(products) {
    productList.innerHTML = "";
    products.forEach((product) => {
      addProductToDOM(product);
    });
  }

  /* adicionar um novo produto no final da  lista */
  function addProductToDOM(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.setAttribute("data-id", product.id);

    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="details">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <span>${product.category}</span>
            <p class="price">$${product.price}</p>
        </div>
        <button class="edit-btn">&#9998;</button>
        <button class="delete-btn">&times;</button>
    `;

    productCard
      .querySelector(".edit-btn")
      .addEventListener("click", () => showEditForm(product));
    productCard
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteProduct(product.id, productCard));
    productList.appendChild(productCard);
  }

  /* função de deletar o produto */
  async function deleteProduct(productId, productCard) {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      productCard.remove();
    }
  }

  /* função para adicionar um produto */
  async function addProduct(event) {
    console.log("addProduct", event);
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    const newProduct = {
      title: name,
      price,
      description,
      category,
      image,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    if (response.ok) {
      const addedProduct = await response.json();
      addProductToDOM(addedProduct);
      formAddProduct.reset();
    }
  }

  /* exibir o form de edicao */
  function showEditForm(product) {
    document.getElementById("edit-id").value = product.id;
    document.getElementById("edit-name").value = product.title;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-image").value = product.image;
    document.getElementById("edit-category").value = product.category;

    editProductId = product.id;
    formEditProduct.style.display = "block";
  }

  /* exibir o modal */
  function showEditModal(product) {
    document.getElementById("modal-image").src = product.image;
    document.getElementById("modal-title").innerText = product.title;
    document.getElementById("modal-description").innerText =
      product.description;
    document.getElementById("modal-price").innerText = `$${product.price}`;
    document.getElementById("modal-category").innerText = product.category;

    editModal.style.display = "block";
  }

  /* função para editar o produto */
  async function editProduct(event) {
    event.preventDefault();
    const id = document.getElementById("edit-id").value;
    const name = document.getElementById("edit-name").value;
    const price = document.getElementById("edit-price").value;
    const description = document.getElementById("edit-description").value;
    const image = document.getElementById("edit-image").value;
    const category = document.getElementById("edit-category").value;

    const updateProduct = {
      title: name,
      price,
      description,
      image,
      category,
    };

    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      fetchProducts();
      formEditProduct.reset();
      formEditProduct.style.display = "none";
      showEditModal(updatedProduct);
    }
  }

  /* fechar modal */
  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  formAddProduct.addEventListener("submit", addProduct);
  formEditProduct.addEventListener("submit", editProduct);

  fetchProducts();
});
