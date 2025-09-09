const treeContainer = document.getElementById("tree-container");
const categoryList = document.getElementById("category-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("your-cart");

let cart = [];
let total = 0;

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
      const categories = [{ category_name: "All Trees", id: "all" }, ...(data.categories || [])];
      displayCategories(categories);
    })
    .catch(err => console.error(err));
};

const displayCategories = (categories) => {
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.className = "category-btn w-full text-left px-3 py-2 rounded hover:bg-green-600 hover:text-white cursor-pointer";
    li.innerText = cat.category_name;
    categoryList.appendChild(li);
  });


  if (categories.length > 0) {
    const firstCategory = document.getElementById(categories[0].id);
    firstCategory.classList.add("bg-green-600", "text-white");
  }

  categoryList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      document.querySelectorAll(".category-btn").forEach(li => {
        li.classList.remove("bg-green-600", "text-white");
      });
      e.target.classList.add("bg-green-600", "text-white");
      loadTrees(e.target.id);
    }
  });
};

const loadTrees = (id) => {
  showSpinner(true);
  let url = id === "all"
    ? "https://openapi.programming-hero.com/api/plants"
    : `https://openapi.programming-hero.com/api/category/${id}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayTrees(data.plants || []);
      showSpinner(false);
    })
    .catch(err => {
      console.error(err);
      treeContainer.innerHTML = "";
      showSpinner(false);
    });
};

const displayTrees = (plants) => {
  treeContainer.innerHTML = "";
  
  if (plants.length === 0) {
    treeContainer.innerHTML = `
      <div class="col-span-3 md:col-span-8 flex justify-center items-center py-10">
        <p class="text-gray-500">No trees found in this category.</p>
      </div>
    `;
    return;
  }
  
  plants.forEach(tree => {
    treeContainer.innerHTML += `
      <div class="card bg-base-100 shadow-sm p-3">
                    <div class="h-[180px] w-full bg-gray-200 rounded overflow-hidden mb-3">
                    <img src="${tree.image}" alt="${tree.name}" class="w-full h-full object-cover"/>
                    </div>
                <div class="card-body">
                    <h2 class="card-title cursor-pointer" onclick="openModal('${tree.id}')">${tree.name}</h2>
                    <p class="text-xs text-gray-500 mb-4 line-clamp-2">${tree.description}</p>
                <div class="card-actions justify-between items-center">
                <div class="px-3 py-2 rounded-full bg-[#DCFCE7] tex-[#15803D]"><p>${tree.category}</p></div>
                    <div>
                        <p><span>৳</span>${tree.price}</p>
                    </div>                                                           
                </div>
                </div>
                 <button onclick='addToCart({name: "${tree.name}", price: ${tree.price}})' class="btn w-full font-semibold bg-[#15803D] text-white rounded-full border-none">Add to Cart</button>
                </div>     

    `;
  });
};

const showSpinner = (show) => {
  if (!document.getElementById("spinner")) {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.id = "spinner";
    spinnerDiv.className = "col-span-8 flex justify-center items-center py-10";
    spinnerDiv.innerHTML = `<span class="loading loading-dots loading-xl"></span>`;
    treeContainer.parentNode.insertBefore(spinnerDiv, treeContainer);
  }
  document.getElementById("spinner").style.display = show ? "flex" : "none";
  treeContainer.style.display = show ? "none" : "grid";
};

const addToCart = (item) => {
  cart.push(item);
  total += item.price;
  renderCart();
  alert(`${item.name} has been added to the cart`);
};

const removeFromCart = (index) => {
  total -= cart[index].price;
  cart.splice(index, 1);
  renderCart();
};

const renderCart = () => {
  cartItemsContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<li class="text-gray-500 text-center py-4">Your cart is empty</li>`;
    cartTotal.innerText = `৳0`;
    return;
  }
  
  cart.forEach((item, index) => {
    cartItemsContainer.innerHTML += `
      <li class="bg-[#f0fdf4] p-3 rounded mb-2">
        <div class="flex justify-between items-center">
          <span class="font-medium">${item.name}</span>
          <button onclick="removeFromCart(${index})" class="text-red-500 font-bold">X</button>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-[#889396] text-sm">৳${item.price}</span>
        </div>
      </li>
    `;
  });
  cartTotal.innerText = `৳${total}`;
};

const openModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => {
      const plant = data.plants;
      const modal = document.getElementById("modalID");
      modal.innerHTML = `
        <div class="modal-box">
          <h3 class="text-lg font-bold">${plant.name}</h3>
          <img class="w-full h-48 object-cover rounded-lg my-3" src="${plant.image}" alt="${plant.name}">
          <p class="py-2">${plant.description}</p>
          <div class="flex justify-between items-center mt-4">
            <p class="bg-[#DCFCE7] px-3 py-1 rounded-full text-[#15803D] text-sm">${plant.category}</p>
            <p class="font-semibold">৳${plant.price}</p>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      `;
      modal.showModal();
    })
    .catch(err => console.error(err));
};

// Initialize the page
loadCategories();
loadTrees("all");
renderCart();