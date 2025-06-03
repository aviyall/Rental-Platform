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
    document.getElementById('product-section').innerHTML = categoryCache[category];
    updateButtonStyles(category);
  } else {
    fetch(`/components/${category}.html`)
      .then(res => res.text())
      .then(data => {
        categoryCache[category] = data;
        document.getElementById('product-section').innerHTML = data;
        updateButtonStyles(category);
      })
      .catch(err => {
        console.error(`Error loading ${category}.html:`, err);
      });
  }
}

//default category when index page load
window.addEventListener('DOMContentLoaded', () => {
    loadCategory('featured');
});

  