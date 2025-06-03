document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) return;

    try {
        const response = await fetch(`https://bgridtechnologies.in/api/product/${productId}`);
        const result = await response.json();
        const product = result.product;

        // Update text content
        document.querySelector(".product-title").textContent = product.name;
        document.querySelector(".product-description").textContent = product.description;
        document.querySelector(".product-price").innerHTML = `₹${product.price} <span class="product-fake-price">₹${product.fake_price}</span>`;
        document.title = product.name;

        // Set main image
        const mainImage = document.getElementById("main-image");
        mainImage.src = product.image_url;

        // Combine main image with additional thumbnails
        const allImages = [product.image_url, ...product.images];

        const thumbContainer = document.getElementById("thumbnail-row");
        thumbContainer.innerHTML = "";

        allImages.forEach(imgUrl => {
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = "Thumbnail";
            img.classList.add("thumbnail");

            img.addEventListener("click", () => {
                mainImage.src = imgUrl;
            });

            thumbContainer.appendChild(img);
        });

    } catch (err) {
        console.error("Failed to fetch product:", err);
    }
});
