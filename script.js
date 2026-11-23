const products = [
  {id:1,name:"Solstice Pendant",category:"necklaces",price:89,image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85",description:"A delicate gold-tone pendant designed to catch the light. An easy everyday layer, worn alone or stacked."},
  {id:2,name:"Sculpted Gold Ring",category:"rings",price:65,image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",description:"A softly sculptural ring with a timeless silhouette. Made for stacking or making a quiet statement on its own."},
  {id:3,name:"Mira Hoops",category:"earrings",price:72,image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85",description:"Lightweight hoops with a clean, modern shape. Your new go-to pair, from slow mornings to late evenings."},
  {id:4,name:"Pearl Drop Necklace",category:"necklaces",price:110,image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85",description:"A subtle pearl detail adds a little softness to this minimal necklace. A thoughtful gift, including for yourself."},
  {id:5,name:"The Everyday Band",category:"rings",price:58,image:"https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=85",description:"A minimal band with a polished finish. Designed to be worn every day and paired with the pieces you already love."},
  {id:6,name:"Celeste Studs",category:"earrings",price:49,image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=85",description:"Small, considered studs that bring a gentle glow to your everyday look."},
  {id:7,name:"Layered Chain",category:"necklaces",price:125,image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85",description:"A ready-made layered look with fine chains and a balanced, effortless finish."},
  {id:8,name:"Organic Signet",category:"rings",price:95,image:"https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=800&q=85",description:"A modern take on a classic signet, with an organic shape and understated character."}
];

const grid = document.querySelector("#product-grid");
const cart = [];
let activeCategory = "all";
let searchTerm = "";
const money = value => `€${value.toFixed(2)}`;

function visibleProducts(){
  let list = products.filter(p => (activeCategory === "all" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm));
  const sort = document.querySelector("#sort-select").value;
  if(sort === "low") list.sort((a,b)=>a.price-b.price);
  if(sort === "high") list.sort((a,b)=>b.price-a.price);
  return list;
}
function renderProducts(){
  const list = visibleProducts();
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-image" data-view="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="quick-add" data-add="${p.id}">Add to bag +</button>
      </div>
      <div class="product-info"><div><div class="product-name">${p.name}</div><div class="product-category">${p.category}</div></div><span class="product-price">${money(p.price)}</span></div>
    </article>`).join("") : `<p class="empty-results">No pieces found. Try another search.</p>`;
}
function updateCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);
  const items = document.querySelector("#cart-items");
  items.innerHTML = cart.map(item=>`
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div><h3>${item.name}</h3><p>${money(item.price)}</p>
        <div class="quantity"><button data-qty="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="1" data-id="${item.id}" aria-label="Increase quantity">+</button></div>
      </div>
      <button class="remove-item" data-remove="${item.id}">Remove</button>
    </div>`).join("");
  const subtotal = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  document.querySelector("#cart-subtotal").textContent=money(subtotal);
  document.querySelector("#cart-empty").hidden=count>0;
  document.querySelector("#cart-footer").hidden=count===0;
}
function addToCart(id){
  const product=products.find(p=>p.id===Number(id));
  const existing=cart.find(p=>p.id===product.id);
  existing ? existing.qty++ : cart.push({...product,qty:1});
  updateCart(); showToast(`${product.name} added to your bag`);
}
function showToast(message){
  const toast=document.querySelector("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function openCart(){
  document.querySelector("#cart-drawer").classList.add("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden","false");
  document.querySelector("#overlay").classList.add("visible");
}
function closeCart(){
  document.querySelector("#cart-drawer").classList.remove("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden","true");
  document.querySelector("#overlay").classList.remove("visible");
}
function openProduct(id){
  const p=products.find(item=>item.id===Number(id));
  document.querySelector("#dialog-content").innerHTML=`<div class="dialog-layout"><img src="${p.image}" alt="${p.name}"><div class="dialog-details"><p class="eyebrow">${p.category.toUpperCase()}</p><h2>${p.name}</h2><strong>${money(p.price)}</strong><p>${p.description}</p><button class="button button-dark" data-dialog-add="${p.id}">Add to bag <span>+</span></button></div></div>`;
  document.querySelector("#product-dialog").showModal();
}

grid.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  if(add){e.stopPropagation();addToCart(add.dataset.add);return;}
  const view=e.target.closest("[data-view]"); if(view)openProduct(view.dataset.view);
});
document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); activeCategory=btn.dataset.category; renderProducts();
}));
document.querySelector("#sort-select").addEventListener("change",renderProducts);
document.querySelector("#search-input").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
document.querySelector("#clear-search").addEventListener("click",()=>{document.querySelector("#search-input").value="";searchTerm="";renderProducts();});
document.querySelector(".search-toggle").addEventListener("click",()=>{
  const panel=document.querySelector("#search-panel");panel.hidden=!panel.hidden;
  if(!panel.hidden)document.querySelector("#search-input").focus();
});
document.querySelector(".cart-toggle").addEventListener("click",openCart);
document.querySelector(".close-cart").addEventListener("click",closeCart);
document.querySelector(".continue-shopping").addEventListener("click",closeCart);
document.querySelector("#overlay").addEventListener("click",closeCart);
document.querySelector("#cart-items").addEventListener("click",e=>{
  const remove=e.target.closest("[data-remove]");
  if(remove){const index=cart.findIndex(p=>p.id===Number(remove.dataset.remove));cart.splice(index,1);updateCart();return;}
  const qty=e.target.closest("[data-qty]");
  if(qty){const item=cart.find(p=>p.id===Number(qty.dataset.id));item.qty+=Number(qty.dataset.qty);if(item.qty<=0)cart.splice(cart.indexOf(item),1);updateCart();}
});
document.querySelector("#product-dialog").addEventListener("click",e=>{
  if(e.target===e.currentTarget)e.currentTarget.close();
  const add=e.target.closest("[data-dialog-add]");if(add){addToCart(add.dataset.dialogAdd);e.currentTarget.close();openCart();}
});
document.querySelector(".dialog-close").addEventListener("click",()=>document.querySelector("#product-dialog").close());
document.querySelector("#newsletter-form").addEventListener("submit",e=>{
  e.preventDefault();document.querySelector("#newsletter-message").textContent="Thank you for joining the LUNARA list!";
  e.target.reset();
});
document.querySelector(".checkout-button").addEventListener("click",()=>showToast("Demo store: checkout is not connected."));
document.querySelector(".menu-toggle").addEventListener("click",e=>{
  const nav=document.querySelector("#main-nav");const open=nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("#main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("#main-nav").classList.remove("open")));

renderProducts();updateCart();
