const soal = {
  m1:[{q:"Apa itu coding?",a:["Bahasa manusia","Instruksi komputer"],k:1}],
  m2:[{q:"Coding digunakan untuk?",a:["Main game","Membuat aplikasi"],k:1}],
  m3:[{q:"Algoritma adalah?",a:["Langkah logis","Bahasa"],k:0}],
  m4:[{q:"HTML berfungsi untuk?",a:["Struktur","Desain"],k:0}],
  m5:[{q:"CSS digunakan untuk?",a:["Logika","Tampilan"],k:1}],
  m6:[{q:"JavaScript membuat website?",a:["Statik","Interaktif"],k:1}],
  m7:[{q:"Variabel berfungsi?",a:["Menyimpan data","Menghapus file"],k:0}],
  m8:[{q:"If digunakan untuk?",a:["Perulangan","Percabangan"],k:1}],
  m9:[{q:"For adalah?",a:["Loop","Kondisi"],k:0}],
  m10:[{q:"Python itu?",a:["Bahasa pemrograman","Browser"],k:0}]
};

document.querySelectorAll(".quiz").forEach(qz=>{
  const id=qz.dataset.materi;
  const s=soal[id][Math.floor(Math.random()*soal[id].length)];
  qz.innerHTML=`<p>${s.q}</p>`+s.a.map((x,i)=>`<button onclick="alert('${i==s.k?'Benar':'Salah'}')">${x}</button>`).join("");
});
