let products = [];

let basket =
JSON.parse(localStorage.getItem("basket")) || [];

updateCartCount();

loadCSV();

document
.getElementById("search")
.addEventListener("input", e => {

renderProducts(
products.filter(p =>
JSON.stringify(p)
.toLowerCase()
.includes(
e.target.value.toLowerCase()
)
)
);

});

function loadCSV(){

Papa.parse("product.csv",{

download:true,

header:true,

skipEmptyLines:true,

complete:function(results){

products = results.data;

renderProducts(products);

}

});

}

function renderProducts(list){

const container =
document.getElementById("products");

container.innerHTML = "";

list.forEach((item,index)=>{

container.innerHTML += `

<div class="card">

<img src="${item.immagine}">

<div class="card-body">

<h3>${item.marca}</h3>

<h4>${item.modello}</h4>

<p class="price">
€ ${item.prezzo}
</p>

<button onclick="showDetails(${index})">
Dettagli
</button>

</div>

</div>

`;

});

}

function showDetails(index){

const p = products[index];

document.getElementById("products")
.classList.add("hidden");

const details =
document.getElementById("details");

details.classList.remove("hidden");

details.innerHTML = `

<div class="details">

<button onclick="backHome()">
← Torna
</button>

<h2>${p.marca}</h2>

<h3>${p.modello}</h3>

<img src="${p.immagine}">

<p>${p.descrizione}</p>

<h2>€ ${p.prezzo}</h2>

<br>

<button onclick="addToBasket(${index})">
Aggiungi al carrello
</button>

</div>

`;

}

function backHome(){

document
.getElementById("details")
.classList.add("hidden");

document
.getElementById("basket")
.classList.add("hidden");

document
.getElementById("products")
.classList.remove("hidden");

}

function addToBasket(index){

basket.push(products[index]);

saveBasket();

alert("Prodotto aggiunto");

}

function saveBasket(){

localStorage.setItem(
"basket",
JSON.stringify(basket)
);

updateCartCount();

}

function updateCartCount(){

document.getElementById(
"cartCount"
).innerText = basket.length;

}

function showBasket(){

document
.getElementById("products")
.classList.add("hidden");

document
.getElementById("details")
.classList.add("hidden");

const basketDiv =
document.getElementById("basket");

basketDiv.classList.remove("hidden");

let total = 0;

let html =
'<div class="basket">';

basket.forEach((item,i)=>{

total += Number(item.prezzo);

html += `

<div class="row">

<div>
${item.marca}
${item.modello}
</div>

<div>
€ ${item.prezzo}
</div>

</div>

`;

});

html += `

<div class="total">

Totale: € ${total.toFixed(2)}

</div>

<br>

<button onclick="generatePDF()">
Stampa PDF
</button>

<button onclick="backHome()">
Continua Shopping
</button>

</div>

`;

basketDiv.innerHTML = html;

}

async function generatePDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);

doc.text(
"ORDINE CLIENTE",
20,
20
);

let y = 40;

let total = 0;

basket.forEach(item=>{

doc.text(
`${item.marca} ${item.modello} - € ${item.prezzo}`,
20,
y
);

y += 10;

total += Number(item.prezzo);

});

y += 10;

doc.text(
`Totale: € ${total.toFixed(2)}`,
20,
y
);

doc.save("ordine.pdf");

}
