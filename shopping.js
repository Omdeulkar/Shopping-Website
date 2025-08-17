/* ==========
   DOM HELPERS
========== */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ==========
   CART
========== */
let cartCount = 0;
const cartBadge = $("#cartCount");
const toast = $("#toast");

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1400);
}

function addToCart(name, price) {
    cartCount += 1;
    cartBadge.textContent = cartCount;
    showToast(`Added “${name}” (₹${price}) to cart`);
}

/* Attach add-to-cart to all buttons */
$$(".btn.add").forEach(btn => {
    btn.addEventListener("click", () => {
        addToCart(btn.dataset.name, btn.dataset.price);
    });
});

/* ==========
   SEARCH
========== */
const searchInput = $("#searchInput");
const searchBtn = $("#searchBtn");

function applySearch() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const cards = $$(".card");
    cards.forEach(c => {
        const title = $("h3", c).textContent.toLowerCase();
        const desc = $(".desc", c).textContent.toLowerCase();
        c.style.display = (title.includes(q) || desc.includes(q)) ? "" : "none";
    });
}

if (searchBtn) searchBtn.addEventListener("click", applySearch);
if (searchInput) searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applySearch();
});

/* ==========
   GLOBAL SEGMENT (All / Men / Women / Kids)
========== */
$$(".seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        $$(".seg-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const seg = btn.dataset.seg; // all | men | women | kids
        const sections = $$(".category");
        sections.forEach(sec => {
            if (seg === "all") {
                sec.style.display = "";
            } else {
                sec.style.display = sec.id === seg ? "" : "none";
            }
        });

        // smooth scroll to first visible section
        const first = sections.find(s => s.style.display !== "none");
        first?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

/* ==========
   PER-SECTION FILTER CHIPS
========== */
$$(".chips").forEach(chipGroup => {
    chipGroup.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        $$(".chip", chipGroup).forEach(c => c.classList.remove("active"));
        btn.classList.add("active");

        const scope = chipGroup.dataset.scope;   // men | women | kids
        const filter = btn.dataset.filter;       // all | shirts | jeans | tshirts | lowers
        const grid = $(`#${scope}Grid`);
        const cards = $$(".card", grid);

        cards.forEach(card => {
            const cat = card.dataset.category;
            card.style.display = (filter === "all" || filter === cat) ? "" : "none";
        });
    });
});

/* ==========
   SORTING
========== */
const sortSelect = $("#sortSelect");
function sortCardsIn(grid, compareFn) {
    const items = $$(".card", grid);
    const frag = document.createDocumentFragment();
    items.sort(compareFn).forEach(i => frag.appendChild(i));
    grid.appendChild(frag);
}

function applySort(value) {
    const grids = ["menGrid", "womenGrid", "kidsGrid"].map(id => document.getElementById(id));
    grids.forEach(grid => {
        if (!grid) return;
        if (value === "price-asc")
            sortCardsIn(grid, (a, b) => (+a.dataset.price) - (+b.dataset.price));
        else if (value === "price-desc")
            sortCardsIn(grid, (a, b) => (+b.dataset.price) - (+a.dataset.price));
        else if (value === "rating-desc")
            sortCardsIn(grid, (a, b) => (+b.dataset.rating) - (+a.dataset.rating));
        else // relevant: keep original order (do nothing)
            null;
    });
}
if (sortSelect) sortSelect.addEventListener("change", e => applySort(e.target.value));

/* ==========
   QUALITY: Anchor smooth scroll
========== */
$$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
