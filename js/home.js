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
    btn.style.color = '#ffffff'; // default text color
    btn.style.border = '1px solid rgb(0, 0, 0)'; // default border
    btn.style.backgroundColor = '#000000'; // default background
  });

  const activeBtn = document.getElementById(category);
  if (activeBtn) {
    activeBtn.style.color = '#000000'; // active text color
    activeBtn.style.border = '1px solid rgb(0, 0, 0)'; // subtle highlight
    activeBtn.style.backgroundColor = '#ffebc1'; // highlight background
  }
}

const categoryCache = {};

function loadCategory(category) {
  if (categoryCache[category]) {
    document.getElementById('product-section').innerHTML = categoryCache[category].html;
    updateButtonStyles(category);
    appendProducts(categoryCache[category].products);
  } else {
    fetch(`/components/${category}.html`)
      .then(res => res.text())
      .then(htmlData => {
        fetch('https://api.bgridtechnologies.in/api/products')
          .then(res => res.json())
          .then(productsData => {
            categoryCache[category] = {
              html: htmlData,
              products: productsData.products
            };

            document.getElementById('product-section').innerHTML = htmlData;
            updateButtonStyles(category);
            appendProducts(productsData.products);
          });
      })
      .catch(err => {
        console.error(`Error loading ${category}:`, err);
      });
  }
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
