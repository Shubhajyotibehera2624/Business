(function () {
  "use strict";

  /* ============ CONFIG ============ */
  const BUSINESS_NAME = "MNC MAYLEEN NUTRICARE";
  const WHATSAPP_NUMBER = "919692915315"; // country code 91 + number, used for wa.me links
  const UPI_ID = "mncmayleennutricare@upi"; // TODO: replace with your real UPI ID before going live

  /* ============ PRODUCT DATA ============ */
  const PRODUCTS = [
    {
      id: "M339",
      name: "Mayleen Male Support+ 60 Tabs",
      category: "Nutrition",
      price: 2040,
      desc: "Daily support tablets formulated for men's everyday vitality.",
      image: "images/male-support.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-male-support-60-tabs-/M339",
      rating: 4.6,
      ratingCount: 32
    },
    {
      id: "M338",
      name: "Mayleen Calcium Pro+ 60 Tabs",
      category: "Nutrition",
      price: 1222,
      desc: "Calcium and co-factors to support bone strength, day after day.",
      image: "images/calcium-pro.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-calcium-pro-60-tabs-/M338",
      rating: 4.7,
      ratingCount: 41
    },
    {
      id: "M221",
      name: "Mayleen EnergyUp Drink Mix — Lemon, 50g",
      category: "Energy",
      price: 790,
      desc: "Refreshing electrolyte mix in lemon flavour. One scoop, quick lift.",
      image: "images/energyup-lemon.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-energyup-refreshing-drink-mix-lemon-flavour-50g-/M221",
      rating: 4.5,
      ratingCount: 27
    },
    {
      id: "M222",
      name: "Mayleen EnergyUp Drink Mix — Ginger, 50g",
      category: "Energy",
      price: 790,
      desc: "The same refreshing lift, in a warm ginger flavour.",
      image: "images/energyup-ginger.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-energyup-refreshing-drink-mix-ginger-flavour-50g-/M222",
      rating: 4.4,
      ratingCount: 19
    },
    {
      id: "M123",
      name: "Mayleen Premium Protein Powder, 400g",
      category: "Protein",
      price: 2498,
      desc: "A full-size tub of premium protein for regular training weeks.",
      image: "images/protein-400g.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-premium-protein-powder-400g-/M123",
      rating: 4.8,
      ratingCount: 58
    },
    {
      id: "M121",
      name: "Mayleen Premium Protein Powder, 200g",
      category: "Protein",
      price: 1249,
      desc: "A starter-size tub — try it before you commit to the full size.",
      image: "images/protein-200g.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-premium-protein-powder-200g-/M121",
      rating: 4.6,
      ratingCount: 22
    },
    {
      id: "M1117",
      name: "Mayleen Nutrition Shake Mix — Strawberry",
      category: "Protein",
      price: 2090,
      desc: "A complete nutrition shake in strawberry, for breakfast or after a workout.",
      image: "images/shake-strawberry.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-premium-nutrition-shake-mix-strawberry-flavour-/M1117",
      rating: 4.5,
      ratingCount: 15
    },
    {
      id: "M111",
      name: "Mayleen Nutrition Shake Mix — Delight Mango, 500g",
      category: "Protein",
      price: 2090,
      desc: "A complete nutrition shake in mango, for breakfast or after a workout.",
      image: "images/shake-mango.png",
      url: "https://mayleennutricare.com/product-detail/mayleen-premium-nutrition-shake-mix-delight-mango-flavour-500g-/M111",
      rating: 4.6,
      ratingCount: 18
    }
  ];

  /* ============ STATE (in-memory only — resets on page reload) ============ */
  const cart = {}; // id -> qty
  const userRatings = {}; // id -> user's chosen star value

  /* ============ ICONS PER CATEGORY ============ */
  function mediaSvg(category) {
    const icons = {
      Nutrition: `<svg viewBox="0 0 100 100"><rect x="30" y="18" width="40" height="70" rx="14" fill="#FFFEFA" stroke="#24422C" stroke-width="3"/><rect x="30" y="18" width="40" height="20" rx="14" fill="#24422C"/><circle cx="50" cy="58" r="4" fill="#D9A441"/><circle cx="50" cy="70" r="4" fill="#D9A441"/></svg>`,
      Energy: `<svg viewBox="0 0 100 100"><path d="M38 14h24l4 16h-8l6 56-30-40h10z" fill="#C7D93B" stroke="#24422C" stroke-width="3" stroke-linejoin="round"/></svg>`,
      Protein: `<svg viewBox="0 0 100 100"><rect x="26" y="24" width="48" height="60" rx="10" fill="#FFFEFA" stroke="#24422C" stroke-width="3"/><rect x="26" y="24" width="48" height="16" rx="10" fill="#8AA07C"/><path d="M40 55c4-6 16-6 20 0s-4 14-10 14-14-8-10-14Z" fill="#D9A441"/></svg>`
    };
    return icons[category] || icons.Nutrition;
  }
  function mediaBg(category) {
    const bg = { Nutrition: "#DCE4CE", Energy: "#F3F0D8", Protein: "#EFE3C6" };
    return bg[category] || "#DCE4CE";
  }

  /* ============ RENDER PRODUCTS ============ */
  function starsMarkup(product) {
    const rounded = Math.round(product.rating);
    let out = '<span class="stars" role="group" aria-label="Rate this product">';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rounded ? "filled" : "";
      out += `<button type="button" class="${filled}" data-id="${product.id}" data-star="${i}" aria-label="Rate ${i} star${i > 1 ? "s" : ""}">★</button>`;
    }
    out += "</span>";
    return out;
  }

  function renderProducts() {
    const grids = document.querySelectorAll("[data-grid]");
    grids.forEach((grid) => {
      const category = grid.getAttribute("data-grid");
      const items = PRODUCTS.filter((p) => p.category === category);
      grid.innerHTML = items.map(productCardHtml).join("");
    });
  }

  function productCardHtml(p) {
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
  <img src="${p.image}" alt="${p.name}" loading="lazy">
</div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-rating">
            ${starsMarkup(p)}
            <span class="rating-meta" data-rating-meta="${p.id}">${p.rating.toFixed(1)} (${p.ratingCount})</span>
          </div>
          <div class="product-footer">
            <span class="product-price">₹${p.price.toLocaleString("en-IN")}</span>
            <a class="product-link" href="${p.url}" target="_blank" rel="noopener">View details</a>
          </div>
          <button class="add-cart-btn" data-add="${p.id}">Add to cart</button>
        </div>
      </article>`;
  }

  /* ============ RATINGS ============ */
  function handleRatingClick(e) {
    const btn = e.target.closest("[data-star]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const star = Number(btn.getAttribute("data-star"));
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    // Fold the user's rating into the displayed average (lightweight client-side simulation).
    if (!userRatings[id]) {
      product.rating = (product.rating * product.ratingCount + star) / (product.ratingCount + 1);
      product.ratingCount += 1;
    } else {
      const prevTotal = product.rating * product.ratingCount - userRatings[id];
      product.rating = (prevTotal + star) / product.ratingCount;
    }
    userRatings[id] = star;

    updateProductCard(id);
    renderReviewsSummary();
    showToast(`Thanks for rating ${star}★`);
  }

  function updateProductCard(id) {
    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    if (!card) return;
    const product = PRODUCTS.find((p) => p.id === id);
    const rounded = Math.round(userRatings[id] || product.rating);
    card.querySelectorAll("[data-star]").forEach((btn) => {
      const v = Number(btn.getAttribute("data-star"));
      btn.classList.toggle("filled", v <= rounded);
    });
    const meta = card.querySelector(`[data-rating-meta="${id}"]`);
    if (meta) meta.textContent = `${product.rating.toFixed(1)} (${product.ratingCount})`;
  }

  function renderReviewsSummary() {
    const wrap = document.getElementById("reviewsSummary");
    if (!wrap) return;
    const sorted = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    wrap.innerHTML = sorted
      .map(
        (p) => `
      <div class="review-card">
        <h4>${p.name}</h4>
        <span class="review-stars">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))}</span>
        <span class="review-count">${p.rating.toFixed(1)} average · ${p.ratingCount} ratings</span>
      </div>`
      )
      .join("");
  }

  /* ============ CART ============ */
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    const btn = document.querySelector(`[data-add="${id}"]`);
    if (btn) {
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to cart";
        btn.classList.remove("added");
      }, 900);
    }
    showToast("Added to cart");
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }

  function removeFromCart(id) {
    delete cart[id];
    renderCart();
  }

  function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }

  function cartSubtotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((pp) => pp.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }

  function renderCart() {
    const count = cartCount();
    document.getElementById("cartCount").textContent = count;

    const itemsWrap = document.getElementById("cartItems");
    const entries = Object.entries(cart);

    if (entries.length === 0) {
      itemsWrap.innerHTML = `<p class="cart-empty" id="cartEmpty">Your cart is empty. Add a product to get started.</p>`;
    } else {
      itemsWrap.innerHTML = entries
        .map(([id, qty]) => {
          const p = PRODUCTS.find((pp) => pp.id === id);
          if (!p) return "";
          return `
          <div class="cart-line" data-line="${id}">
            <div class="cart-line-media" style="background:${mediaBg(p.category)}">${mediaSvg(p.category)}</div>
            <div class="cart-line-body">
              <span class="cart-line-name">${p.name}</span>
              <span class="cart-line-price">₹${p.price.toLocaleString("en-IN")} each</span>
              <div class="qty-row">
                <button class="qty-btn" data-qty="-1" data-id="${id}" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${qty}</span>
                <button class="qty-btn" data-qty="1" data-id="${id}" aria-label="Increase quantity">+</button>
                <button class="remove-line" data-remove="${id}">Remove</button>
              </div>
            </div>
          </div>`;
        })
        .join("");
    }

    const subtotal = cartSubtotal();
    document.getElementById("cartSubtotal").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    document.getElementById("checkoutBtn").disabled = subtotal === 0;
  }

  /* ============ CART DRAWER OPEN/CLOSE ============ */
  const cartDrawer = document.getElementById("cartDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");

  function openCart() {
    cartDrawer.classList.add("open");
    drawerOverlay.classList.add("open");
    document.getElementById("cartToggle").setAttribute("aria-expanded", "true");
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.getElementById("cartToggle").setAttribute("aria-expanded", "false");
  }

  /* ============ PAYMENT MODAL ============ */
  const modalOverlay = document.getElementById("modalOverlay");
  let qrRendered = false;

  function openModal() {
    const subtotal = cartSubtotal();
    document.getElementById("modalAmount").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    document.getElementById("upiIdText").textContent = UPI_ID;

    const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${subtotal}&cu=INR`;
    const qrHolder = document.getElementById("qrcode");
    qrHolder.innerHTML = "";
    if (window.QRCode) {
      new QRCode(qrHolder, {
        text: upiUri,
        width: 176,
        height: 176,
        colorDark: "#1C2B1F",
        colorLight: "#FFFEFA"
      });
    } else {
      qrHolder.textContent = "QR unavailable — use the UPI ID below.";
    }

    modalOverlay.classList.add("open");
    closeCart();
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
  }

  /* ============ WHATSAPP ORDER MESSAGE ============ */
  function buildOrderMessage() {
    const lines = [`Hi ${BUSINESS_NAME}, I'd like to order:`, ""];
    Object.entries(cart).forEach(([id, qty]) => {
      const p = PRODUCTS.find((pp) => pp.id === id);
      if (p) lines.push(`• ${p.name} x${qty} — ₹${(p.price * qty).toLocaleString("en-IN")}`);
    });
    lines.push("");
    lines.push(`Total: ₹${cartSubtotal().toLocaleString("en-IN")}`);
    lines.push(`UPI ID used: ${UPI_ID}`);
    lines.push("I've completed the UPI payment — please confirm and share delivery details.");
    return lines.join("\n");
  }

  function sendOrderOnWhatsapp() {
    const text = encodeURIComponent(buildOrderMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  }

  /* ============ TOAST ============ */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ============ EVENTS ============ */
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) return addToCart(addBtn.getAttribute("data-add"));

    const starBtn = e.target.closest("[data-star]");
    if (starBtn) return handleRatingClick(e);

    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) return changeQty(qtyBtn.getAttribute("data-id"), Number(qtyBtn.getAttribute("data-qty")));

    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) return removeFromCart(removeBtn.getAttribute("data-remove"));
  });

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("drawerOverlay").addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", openModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.getElementById("copyUpi").addEventListener("click", () => {
    navigator.clipboard.writeText(UPI_ID).then(() => showToast("UPI ID copied"));
  });

  document.getElementById("confirmWhatsapp").addEventListener("click", () => {
    sendOrderOnWhatsapp();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeModal();
    }
  });

  /* ============ INIT ============ */
  document.getElementById("year").textContent = new Date().getFullYear();
  renderProducts();
  renderReviewsSummary();
  renderCart();
})();