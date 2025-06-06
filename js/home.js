const mainInput = document.getElementById('main-search');
const overlay = document.getElementById('searchOverlay');
const overlayInput = document.getElementById('overlay-search');

mainInput.addEventListener('focus', () => {
    overlay.style.display = 'flex';
    setTimeout(() => overlayInput.focus(), 100); // delay to ensure focus
});

overlayInput.addEventListener('blur', () => {
    overlay.style.display = 'none';
    mainInput.value = overlayInput.value; // sync values
});

//category section loading
function updateButtonStyles(category) {
  const buttons = document.querySelectorAll('.category-btn');

  buttons.forEach(btn => {
    btn.style.color = '#ffffff';
    btn.style.border = '1px solid rgb(0, 0, 0)';
    btn.style.backgroundColor = '#000000';
  });

  const activeBtn = document.getElementById(category);
  if (activeBtn) {
    activeBtn.style.color = '#000000';
    activeBtn.style.border = '1px solid rgb(0, 0, 0)';
    activeBtn.style.backgroundColor = '#ffebc1';
  } else {
    console.warn(`No button with id="${category}" found`);
  }
}

const categoryCache = {};

function loadCategory(category) {
  updateButtonStyles(category); // ensure style is updated immediately

  if (categoryCache[category]) {
    updateCategorySection(categoryCache[category], category);
  } else {
    fetch(`https://api.bgridtechnologies.in/api/category-items/${category}`)
      .then(res => res.json())
      .then(data => {
        categoryCache[category] = data;
        updateCategorySection(data, category);
      })
      .catch(err => {
        console.error(`Error loading category ${category}:`, err);
      });
  }
}

function updateCategorySection(data, category) {
  document.getElementById('category-heading').textContent = data.heading;
  updateButtonStyles(category);
  appendProducts(data.products);
}

function appendProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) {
    console.error('product-grid element not found!');
    return;
  }
  grid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('a');
    card.href = `/pages/product.html?id=${product.id}`;
    card.className = 'product-card';
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: auto;">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadCategory('featured');
});
