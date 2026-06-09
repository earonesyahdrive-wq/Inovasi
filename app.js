// ======================
// FIREBASE
// ======================

const firebaseConfig = {
apiKey: "AIzaSyAV4elg7kaRtL7MTXtrb9oWOOuF2e5qlJ4",
authDomain: "inovasi123-e8266.firebaseapp.com",
databaseURL: "https://inovasi123-e8266-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "inovasi123-e8266",
storageBucket: "inovasi123-e8266.firebasestorage.app",
messagingSenderId: "881339507290",
appId: "1:881339507290:web:867805e92aeb40f0742e63"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const pegawaiRef = db.ref("pegawai");
const inovasiRef = db.ref("inovasi");

const output = document.getElementById("output");

let allData = [];
let editId = null;

// ======================
// LOAD DATA
// ======================

async function loadData(){

const pegawaiSnap = await pegawaiRef.once("value");
const inovasiSnap = await inovasiRef.once("value");

const pegawai = pegawaiSnap.val() || {};
const inovasi = inovasiSnap.val() || {};

allData = [];

Object.keys(inovasi).forEach(id=>{

const inv = inovasi[id];
const p = pegawai[inv.nip] || {};

allData.push({
id,
nip:inv.nip,
nama:p.nama || "",
judul:inv.judul || "",
kategori:inv.kategori || "",
status:inv.status || "diajukan",
dasarHukum:inv.dasarHukum || "",
latarBelakang:inv.latarBelakang || "",
deskripsi:inv.deskripsi || "",
tujuan:inv.tujuan || "",
tempatTugas:p.tempatTugas || "",
jabatan:p.jabatan || ""
});

});

renderTable(allData);
renderDashboard();
}

// ======================
// TABLE
// ======================

function renderTable(data){

output.innerHTML="";

data.forEach(item=>{

output.innerHTML += `

<tr>
<td>${item.nip}</td>
<td>${item.nama}</td>
<td>${item.judul}</td>
<td>${item.kategori}</td>
<td>${item.status}</td>
<td>
<button onclick="editData('${item.id}')">Edit</button>
<button onclick="hapusData('${item.id}')">Hapus</button>
</td>
</tr>
`;});

}

// ======================
// DASHBOARD
// ======================

function renderDashboard(){

const total = allData.length;

const diajukan =
allData.filter(x=>x.status==="diajukan").length;




document.getElementById("dashboard").innerHTML = `

<div class="stat">Total<br>${total}</div>
<div class="stat">Diajukan<br>${diajukan}</div>
<div class="stat">Disetujui<br>${disetujui}</div>
<div class="stat">Ditolak<br>${ditolak}</div>
`;}

// ======================
// SIMPAN
// ======================

async function ajukan(){

const nip = nipEl("nip");
const nama = nipEl("nama");
const tempatTugas = nipEl("tempatTugas");
const jabatan = nipEl("jabatan");

const judul = nipEl("judul");
const kategori = nipEl("kategori");
const dasarHukum = nipEl("dasarHukum");
const latarBelakang = nipEl("latarBelakang");
const deskripsi = nipEl("deskripsi");
const tujuan = nipEl("tujuan");

if(!nip || !nama || !judul){
alert("Lengkapi data");
return;
}

await pegawaiRef.child(nip).set({
nama,
tempatTugas,
jabatan
});

const data = {
nip,
judul,
kategori,
dasarHukum,
latarBelakang,
deskripsi,
tujuan,
status:"diajukan"
};

if(editId){
await inovasiRef.child(editId).update(data);
editId = null;
}else{
data.createdAt = Date.now();
await inovasiRef.push(data);
}

resetForm();
loadData();

}

// ======================
// EDIT
// ======================

function editData(id){

const d = allData.find(x=>x.id===id);

if(!d) return;

setVal("nip",d.nip);
setVal("nama",d.nama);
setVal("tempatTugas",d.tempatTugas);
setVal("jabatan",d.jabatan);
setVal("judul",d.judul);
setVal("kategori",d.kategori);
setVal("dasarHukum",d.dasarHukum);
setVal("latarBelakang",d.latarBelakang);
setVal("deskripsi",d.deskripsi);
setVal("tujuan",d.tujuan);

editId = id;

window.scrollTo(0,0);

}

// ======================
// HAPUS
// ======================

async function hapusData(id){

if(!confirm("Hapus data?")) return;

await inovasiRef.child(id).remove();

loadData();

}

// ======================
// FILTER
// ======================

function filterStatus(status){

renderTable(
allData.filter(x=>x.status===status)
);

}

// ======================
// UTIL
// ======================

function nipEl(id){
return document.getElementById(id).value.trim();
}

function setVal(id,val){
document.getElementById(id).value = val;
}

function resetForm(){

[
"nip","nama","tempatTugas","jabatan",
"judul","kategori","dasarHukum",
"latarBelakang","deskripsi","tujuan"
].forEach(id=>setVal(id,""));

}

window.onload = loadData;
