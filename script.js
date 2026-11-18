const WA="918088237874";
let products=[];
let cart=JSON.parse(localStorage.getItem("golden-hour-cart")||"[]");
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const $=s=>document.querySelector(s);
const grid=$("#product-grid");
$(".hero-art").innerHTML='<div class="sun-disc"></div><div class="hero-vase"></div><div class="hero-candle"><i></i><b></b><span>GOLDEN<br>HOUR</span></div><div class="hero-plinth"></div><div class="art-caption">A GOOD DAY, HELD A LITTLE LONGER.</div>';
$(".story-art").innerHTML='<div class="story-shelf"></div><div class="story-jar"></div><div class="story-stem">✳</div>';
function save(){localStorage.setItem("golden-hour-cart",JSON.stringify(cart));renderCart()}
function renderProducts(filter="All"){
 const shown=products.filter(p=>filter==="All"||p.category===filter);
 grid.innerHTML=shown.map(p=>'<article class="product-card"><div class="product-art" style="--bg:'+p.tone+';--jar-dark:'+p.jar[0]+';--jar-light:'+p.jar[1]+';--jar-mid:'+p.jar[2]+'"><div class="jar">GOLDEN<br>HOUR</div></div><div class="product-meta"><small>'+p.category+' · SCENTED CANDLE</small><h3>'+p.name+'</h3><p>'+p.notes+'</p><div class="product-bottom"><strong>'+money(p.price)+'</strong><button class="add-button" data-add="'+p.id+'">Add to bag +</button></div></div></article>').join("")||"<p>No candles in this collection yet.</p>";
}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);
 $("#bag-count").textContent=count;
 $("#subtotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 $("#cart-items").innerHTML=cart.length?cart.map(x=>'<div class="cart-row"><div><strong>'+x.name+'</strong><small>'+money(x.price)+' each</small></div><div class="qty"><button data-qty="'+x.id+'" data-delta="-1" aria-label="Remove one">−</button><span>'+x.qty+'</span><button data-qty="'+x.id+'" data-delta="1" aria-label="Add one">+</button></div></div>').join(""):'<p class="empty-bag">Your bag is waiting for a little something.</p>';
 $("#checkout-open").disabled=!cart.length;
 $("#checkout-open").style.opacity=cart.length?1:.5;
}
function openBag(open){
 $("#cart-drawer").classList.toggle("open",open);
 $("#drawer-backdrop").classList.toggle("open",open);
 $("#cart-drawer").setAttribute("aria-hidden",String(!open));
}
function checkout(open){$("#checkout-modal").classList.toggle("open",open)}
fetch("products.json").then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{products=d;renderProducts();renderCart()}).catch(()=>{grid.innerHTML="<p>Our collection is taking a short pause. Please check back soon.</p>"});
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");
 if(add){
  const p=products.find(x=>x.id===add.dataset.add);
  const item=cart.find(x=>x.id===p.id);
  if(item)item.qty++;else cart.push({...p,qty:1});
  save();add.textContent="Added ✓";setTimeout(()=>add.textContent="Add to bag +",900);
 }
 const q=e.target.closest("[data-qty]");
 if(q){const x=cart.find(i=>i.id===q.dataset.qty);x.qty+=Number(q.dataset.delta);if(x.qty<=0)cart=cart.filter(i=>i.id!==x.id);save()}
 const f=e.target.closest("[data-filter]");
 if(f){document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===f));renderProducts(f.dataset.filter)}
});
$("#bag-open").onclick=()=>openBag(true);
$("#bag-close").onclick=()=>openBag(false);
$("#drawer-backdrop").onclick=()=>openBag(false);
$("#checkout-open").onclick=()=>{openBag(false);checkout(true)};
$("#checkout-close").onclick=()=>checkout(false);
$("#checkout-modal").addEventListener("click",e=>{if(e.target.id==="checkout-modal")checkout(false)});
$("#menu-toggle").onclick=()=>document.querySelector(".site-header nav").classList.toggle("show");
document.querySelectorAll(".site-header nav a").forEach(a=>a.onclick=()=>document.querySelector(".site-header nav").classList.remove("show"));
$("#checkout-form").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length)return;
 const d=Object.fromEntries(new FormData(e.target));
 const lines=cart.map(x=>"• "+x.name+" × "+x.qty+" — "+money(x.price*x.qty)).join("\n");
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const msg="Hello Golden Hour! I'd like to place an order.\n\n"+lines+"\n\nSubtotal: "+money(total)+"\n\nName: "+d.name+"\nPhone: "+d.phone+"\nEmail: "+(d.email||"Not provided")+"\nDelivery address: "+d.address+"\nNotes: "+(d.notes||"None")+"\n\nPlease confirm availability, delivery charges and payment details.\n";
 window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank","noopener");
});
$("#year").textContent=new Date().getFullYear();
