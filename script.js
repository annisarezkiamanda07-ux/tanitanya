const seedQuestions=[
{id:1,title:"Daun cabai saya menguning dan menggulung, apa penyebabnya?",tag:"Hama & Penyakit",body:"Tanaman cabai saya berumur sekitar 40 hari. Beberapa daun bagian atas terlihat menguning dan menggulung. Saya sudah menyiram secara rutin. Kira-kira apa penyebabnya dan bagaimana penanganannya?",author:"Rina",time:"2 jam lalu",answers:[{author:"Pak Dedi",body:"Coba cek bagian bawah daun dengan teliti. Jika ada kutu/serangga kecil, bisa menjadi salah satu penyebab. Kurangi kelembapan berlebih dan lakukan pengendalian sesuai rekomendasi."}]},
{id:2,title:"Pupuk apa yang cocok untuk tanaman tomat saat mulai berbunga?",tag:"Pupuk",body:"Tomat saya sudah mulai berbunga. Saya ingin bunga tidak mudah rontok dan tanaman tetap sehat. Jenis pupuk apa yang sebaiknya digunakan?",author:"Bagas",time:"5 jam lalu",answers:[]},
{id:3,title:"Cara sederhana membuat kompos dari sisa sayuran?",tag:"Budidaya",body:"Saya memiliki banyak sisa sayuran dari rumah dan ingin memanfaatkannya menjadi kompos. Bagaimana langkah sederhana yang bisa dilakukan skala rumah tangga?",author:"Salsa",time:"Kemarin",answers:[{author:"Ayu",body:"Cacah bahan, campurkan bahan hijau dan bahan cokelat, jaga kelembapan, lalu lakukan pembalikan secara berkala sampai matang."}]},
{id:4,title:"Ada aplikasi untuk mencatat kegiatan budidaya?",tag:"Teknologi",body:"Saya ingin mencatat jadwal tanam, pemupukan, penyiraman, dan panen agar lebih teratur. Ada rekomendasi cara atau aplikasi yang mudah digunakan?",author:"Fajar",time:"2 hari lalu",answers:[]}
];
let questions=JSON.parse(localStorage.getItem("taniQuestions")||"null")||seedQuestions;
let currentId=null;
let selectedTag="";

function save(){localStorage.setItem("taniQuestions",JSON.stringify(questions))}
function showPage(page){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 document.getElementById(page+"Page").classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
 if(page==="questions")renderQuestions();
 if(page==="home")renderLatest();
}
function renderLatest(){
 const box=document.getElementById("latestList");
 box.innerHTML=questions.slice(0,3).map(q=>cardHTML(q)).join("");
 document.getElementById("statQuestions").textContent=questions.length;
 document.getElementById("statAnswers").textContent=questions.reduce((a,q)=>a+q.answers.length,0);
}
function cardHTML(q){return `<article class="card" onclick="openDetail(${q.id})"><span class="tag">${q.tag}</span><h3>${escapeHtml(q.title)}</h3><p class="meta">${escapeHtml(q.author)} · ${q.time} · ${q.answers.length} jawaban</p></article>`}
function renderQuestions(){
 const term=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const list=questions.filter(q=>(!selectedTag||q.tag===selectedTag)&&(`${q.title} ${q.body} ${q.tag}`.toLowerCase().includes(term)));
 document.getElementById("questionList").innerHTML=list.length?list.map(q=>`<article class="question-item" onclick="openDetail(${q.id})"><span class="tag">${q.tag}</span><h3>${escapeHtml(q.title)}</h3><p>${escapeHtml(q.body.slice(0,170))}${q.body.length>170?"…":""}</p><span class="meta">${escapeHtml(q.author)} · ${q.time} · ${q.answers.length} jawaban</span></article>`).join(""):`<div class="detail-card"><h3>Belum ada hasil</h3><p class="muted">Coba kata kunci atau topik lain.</p></div>`;
}
function filterTag(tag){selectedTag=tag;showPage("questions");document.getElementById("searchInput").value="";renderQuestions()}
function openDetail(id){
 currentId=id;const q=questions.find(x=>x.id===id);if(!q)return;
 document.getElementById("detail").innerHTML=`<article class="detail-card"><span class="tag">${q.tag}</span><h1>${escapeHtml(q.title)}</h1><p class="meta">Ditanyakan oleh <b>${escapeHtml(q.author)}</b> · ${q.time}</p><div class="detail-body">${escapeHtml(q.body)}</div><div class="answers"><h2>Jawaban (${q.answers.length})</h2>${q.answers.length?q.answers.map(a=>`<div class="answer"><b>🌿 ${escapeHtml(a.author)}</b><p>${escapeHtml(a.body)}</p></div>`).join(""):"<p class='muted'>Belum ada jawaban. Jadilah yang pertama membantu.</p>"}<form class="answer-form" onsubmit="submitAnswer(event)"><textarea id="answerBody" rows="4" required placeholder="Tulis jawaban atau pengalamanmu..."></textarea><div style="text-align:right;margin-top:10px"><button class="primary">Kirim Jawaban</button></div></form></div></article>`;
 showPage("detail");
}
function submitAnswer(e){e.preventDefault();const body=document.getElementById("answerBody").value.trim();if(!body)return;const q=questions.find(x=>x.id===currentId);q.answers.push({author:"Pengguna TaniTanya",body});save();toast("Jawaban berhasil ditambahkan.");openDetail(currentId)}
function submitQuestion(e){e.preventDefault();const title=document.getElementById("qTitle").value.trim(),body=document.getElementById("qBody").value.trim(),tag=document.getElementById("qTag").value;
 const q={id:Date.now(),title,tag,body,author:"Pengguna TaniTanya",time:"Baru saja",answers:[]};questions.unshift(q);save();e.target.reset();document.getElementById("imagePreview").innerHTML="";toast("Pertanyaan berhasil dipublikasikan.");showPage("questions")
}
function previewImage(e){const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);document.getElementById("imagePreview").innerHTML=`<img class="preview" src="${url}" alt="Pratinjau foto">`}
function toggleProfile(){const logged=localStorage.getItem("taniLogin")==="1";if(logged){localStorage.removeItem("taniLogin");document.getElementById("profileBtn").textContent="Masuk";toast("Kamu telah keluar.");}else{localStorage.setItem("taniLogin","1");document.getElementById("profileBtn").textContent="Akun";toast("Mode pengguna demo aktif.");}}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
(function(){document.getElementById("profileBtn").textContent=localStorage.getItem("taniLogin")==="1"?"Akun":"Masuk";renderLatest()})();
