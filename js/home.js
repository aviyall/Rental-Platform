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
      btn.style.color = '#FFFFFF'; // reset all buttons to default
      btn.style.border = '1px solid rgba(125, 125, 125, 0.533)'; // reset all buttons to default
    });
  
    const activeBtn = document.getElementById(category);
    if (activeBtn) {
      activeBtn.style.color = '#ffebc1';
      activeBtn.style.border = '1px solid rgba(215, 215, 215, 0.533)'; // change border color to match text
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

  