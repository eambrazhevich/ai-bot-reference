const $ = (id) => document.getElementById(id);
const state = { page: 1, category: "", sort: "featured" };

async function api(path, body) {
  const res = await fetch(path, body
    ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }
    : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

let toastTimer;
function toast(text) {
  $("toast").textContent = text;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("toast").hidden = true; }, 1800);
}

/* Catalog */

async function loadCategories() {
  const categories = await api("/api/categories");
  const all = { id: "", name: "All products", count: categories.reduce((n, c) => n + c.count, 0) };
  $("categories").replaceChildren(...[all, ...categories].map((c) => {
    const li = el("li");
    const button = el("button", c.id === state.category ? "active" : "");
    button.type = "button";
    button.append(el("span", "", c.name), el("span", "muted", String(c.count)));
    button.onclick = () => {
      state.category = c.id;
      state.page = 1;
      loadCategories();
      loadProducts();
    };
    li.append(button);
    return li;
  }));
}

function productCard(p) {
  const li = el("li", "card");
  const tile = el("div", `tile ${p.category}`, p.emoji);
  if (p.featured) tile.append(el("span", "tag", "★ Featured"));
  const body = el("div", "card-body");
  const foot = el("div", "card-foot");
  const add = el("button", "add", "Add");
  add.type = "button";
  add.onclick = async () => {
    renderCart(await api("/api/cart/add", { id: p.id }));
    toast(`${p.name} added to cart`);
  };
  foot.append(el("span", "price", p.price), add);
  body.append(el("span", "card-name", p.name), el("span", "card-cat muted", p.category), foot);
  li.append(tile, body);
  return li;
}

async function loadProducts() {
  const params = new URLSearchParams({ q: $("search").value, category: state.category, sort: state.sort, page: String(state.page) });
  const data = await api(`/api/products?${params}`);
  state.page = data.page;
  $("results").textContent = `${data.total} products`;
  $("page").textContent = `Page ${data.page} of ${data.pages}`;
  $("prev").disabled = data.page <= 1;
  $("next").disabled = data.page >= data.pages;
  $("products").replaceChildren(...(data.items.length
    ? data.items.map(productCard)
    : [el("li", "no-results", "Nothing found")]));
}

/* Cart */

function renderBadge(cart) {
  $("badge").textContent = String(cart.count);
}

function renderSummary(cart) {
  $("subtotal").textContent = cart.subtotal;
  $("discount").textContent = cart.promo ? `−${cart.discount}` : "—";
  $("shipping").textContent = cart.shipping;
  $("total").textContent = cart.total;
  $("empty").hidden = cart.items.length > 0;
  $("checkout").disabled = cart.items.length === 0;
}

function renderCart(cart) {
  $("cart").replaceChildren(...cart.items.map((item) => {
    const li = el("li", "cart-line");
    const info = el("div");
    info.append(el("div", "line-name", item.name), el("div", "line-sub", `${item.price} each · ${item.lineTotal}`));
    const qty = el("input");
    qty.type = "number";
    qty.min = "0";
    qty.value = String(item.quantity);
    qty.onchange = async () => renderCart(await api("/api/cart/quantity", { id: item.id, quantity: Number(qty.value) }));
    const remove = el("button", "remove", "Remove");
    remove.type = "button";
    remove.onclick = async () => renderCartLines(await api("/api/cart/remove", { id: item.id }));
    const actions = el("div", "line-actions");
    actions.append(qty, remove);
    li.append(el("div", "line-emoji", item.emoji), info, actions);
    return li;
  }));
  renderSummary(cart);
  renderBadge(cart);
}

function renderCartLines(cart) {
  $("cart").replaceChildren(...cart.items.map((item) => {
    const li = el("li", "cart-line");
    li.append(el("div", "line-emoji", item.emoji), el("div", "line-name", `${item.name} × ${item.quantity}`));
    return li;
  }));
  renderSummary(cart);
}

function openCart(open) {
  $("drawer").classList.toggle("open", open);
  $("backdrop").hidden = !open;
}

/* Events */

let searchTimer;
$("search").oninput = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.page = 1; loadProducts(); }, 150);
};
$("sort").onchange = () => { state.sort = $("sort").value; state.page = 1; loadProducts(); };
$("prev").onclick = () => { state.page -= 1; loadProducts(); };
$("next").onclick = () => { state.page += 1; loadProducts(); };
$("open-cart").onclick = () => openCart(true);
$("close-cart").onclick = () => openCart(false);
$("backdrop").onclick = () => openCart(false);

$("promo-form").onsubmit = async (event) => {
  event.preventDefault();
  const msg = $("promo-msg");
  try {
    const cart = await api("/api/cart/promo", { code: $("promo").value });
    renderCart(cart);
    msg.className = "promo-msg ok";
    msg.textContent = `Code ${cart.promo} applied`;
  } catch (err) {
    msg.className = "promo-msg error";
    msg.textContent = err.message;
  }
};

$("checkout").onclick = async () => {
  const order = await api("/api/checkout", {});
  $("order-text").textContent = `Order #${order.id} is placed. You paid ${order.total}.`;
  openCart(false);
  $("order").showModal();
  $("promo").value = "";
  $("promo-msg").textContent = "";
  renderCart(await api("/api/cart"));
};

loadCategories();
loadProducts();
api("/api/cart").then(renderCart);
