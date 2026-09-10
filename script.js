const KEY="careplus_hms_v1";
let data=JSON.parse(localStorage.getItem(KEY))||{
 patients:[
  {id:"P001",name:"Rahul Kumar",age:28,gender:"Male",phone:"9876543210",disease:"Fever"},
  {id:"P002",name:"Priya Singh",age:35,gender:"Female",phone:"9123456780",disease:"General Checkup"}
 ],
 doctors:[
  {id:"D001",name:"Dr. Amit Sharma",speciality:"Cardiologist",phone:"9000000001"},
  {id:"D002",name:"Dr. Neha Singh",speciality:"General Physician",phone:"9000000002"},
  {id:"D003",name:"Dr. Raj Verma",speciality:"Orthopedic",phone:"9000000003"}
 ],
 appointments:[],
 bills:[]
};
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function $(id){return document.getElementById(id)}
function showPage(page){
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
 $(page).classList.remove("hidden");
 document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 $("pageTitle").textContent=page[0].toUpperCase()+page.slice(1);
 if(page==="dashboard") renderDashboard();
 if(page==="patients") renderPatients();
 if(page==="doctors") renderDoctors();
 if(page==="appointments") renderAppointments();
 if(page==="billing") renderBills();
 if(page==="ai") initAI();
}
function openModal(id){$(id).classList.add("show"); fillSelects()}
function closeModal(id){$(id).classList.remove("show")}
function id(prefix,list){return prefix+String(list.length+1).padStart(3,"0")}
function fillSelects(){
 $("aPatient").innerHTML='<option value="">Select Patient</option>'+data.patients.map(p=>`<option value="${p.id}">${p.name} (${p.id})</option>`).join("");
 $("bPatient").innerHTML='<option value="">Select Patient</option>'+data.patients.map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
 $("aDoctor").innerHTML='<option value="">Select Doctor</option>'+data.doctors.map(d=>`<option value="${d.id}">${d.name} - ${d.speciality}</option>`).join("");
}
function renderDashboard(){
 $("patientCount").textContent=data.patients.length;
 $("doctorCount").textContent=data.doctors.length;
 $("appointmentCount").textContent=data.appointments.length;
 $("revenue").textContent="₹"+data.bills.reduce((s,b)=>s+Number(b.amount),0).toLocaleString("en-IN");
 $("recentPatients").innerHTML=data.patients.slice(-5).reverse().map(p=>`<p class="row"><b>${p.name}</b> — ${p.disease||"Checkup"}</p>`).join("")||"<p>No patients</p>";
 let today=new Date().toISOString().slice(0,10);
 let ap=data.appointments.filter(a=>a.date===today);
 $("todayAppointments").innerHTML=ap.map(a=>`<p><b>${a.time}</b> — ${patientName(a.patient)} with ${doctorName(a.doctor)}</p>`).join("")||"<p>No appointments today.</p>";
}
function patientName(id){let p=data.patients.find(x=>x.id===id);return p?p.name:id}
function doctorName(id){let d=data.doctors.find(x=>x.id===id);return d?d.name:id}
function renderPatients(){
 let q=($("patientSearch").value||"").toLowerCase();
 $("patientTable").innerHTML=data.patients.filter(p=>(p.name+p.phone+p.id).toLowerCase().includes(q)).map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td><td>${p.phone}</td><td><button class="danger" onclick="deletePatient('${p.id}')">Delete</button></td></tr>`).join("");
}
function renderDoctors(){
 $("doctorGrid").innerHTML=data.doctors.map(d=>`<div class="doctor"><div class="avatar">👨‍⚕️</div><h3>${d.name}</h3><p>${d.speciality}</p><p>📞 ${d.phone||"Not provided"}</p><button class="danger" onclick="deleteDoctor('${d.id}')">Delete</button></div>`).join("");
}
function renderAppointments(){
 $("appointmentTable").innerHTML=data.appointments.map((a,i)=>`<tr><td>${patientName(a.patient)}</td><td>${doctorName(a.doctor)}</td><td>${a.date}</td><td>${a.time}</td><td><span class="status">${a.status}</span></td><td><button class="danger" onclick="deleteAppointment(${i})">Delete</button></td></tr>`).join("")||'<tr><td colspan="6">No appointments</td></tr>';
}
function renderBills(){
 $("billTable").innerHTML=data.bills.map((b,i)=>`<tr><td>${b.id}</td><td>${patientName(b.patient)}</td><td>${b.service}</td><td>₹${Number(b.amount).toLocaleString("en-IN")}</td><td>${b.date}</td><td><button class="danger" onclick="deleteBill(${i})">Delete</button></td></tr>`).join("")||'<tr><td colspan="6">No bills</td></tr>';
}
function deletePatient(pid){if(confirm("Delete this patient?")){data.patients=data.patients.filter(p=>p.id!==pid);save();renderPatients();renderDashboard()}}
function deleteDoctor(did){if(confirm("Delete this doctor?")){data.doctors=data.doctors.filter(d=>d.id!==did);save();renderDoctors()}}
function deleteAppointment(i){if(confirm("Delete appointment?")){data.appointments.splice(i,1);save();renderAppointments();renderDashboard()}}
function deleteBill(i){if(confirm("Delete bill?")){data.bills.splice(i,1);save();renderBills();renderDashboard()}}
$("loginForm").addEventListener("submit",e=>{e.preventDefault();if($("username").value==="admin"&&$("password").value==="admin123"){sessionStorage.logged="1";$("loginPage").classList.add("hidden");$("app").classList.remove("hidden");renderDashboard()}else alert("Invalid login. Use admin / admin123")});
$("logoutBtn").onclick=()=>{sessionStorage.removeItem("logged");location.reload()};
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
$("patientForm").onsubmit=e=>{e.preventDefault();data.patients.push({id:id("P",data.patients),name:$("pName").value,age:$("pAge").value,gender:$("pGender").value,phone:$("pPhone").value,disease:$("pDisease").value});save();e.target.reset();closeModal("patientModal");renderPatients();renderDashboard();alert("Patient added successfully")};
$("doctorForm").onsubmit=e=>{e.preventDefault();data.doctors.push({id:id("D",data.doctors),name:$("dName").value,speciality:$("dSpeciality").value,phone:$("dPhone").value});save();e.target.reset();closeModal("doctorModal");renderDoctors();alert("Doctor added successfully")};
$("appointmentForm").onsubmit=e=>{e.preventDefault();data.appointments.push({patient:$("aPatient").value,doctor:$("aDoctor").value,date:$("aDate").value,time:$("aTime").value,status:"Scheduled"});save();e.target.reset();closeModal("appointmentModal");renderAppointments();renderDashboard();alert("Appointment booked successfully")};
$("billForm").onsubmit=e=>{e.preventDefault();data.bills.push({id:id("B",data.bills),patient:$("bPatient").value,service:$("bService").value,amount:$("bAmount").value,date:new Date().toLocaleDateString("en-IN")});save();e.target.reset();closeModal("billModal");renderBills();renderDashboard();alert("Bill created successfully")};
function bot(text){$("chat").insertAdjacentHTML("beforeend",`<div class="msg bot">🤖 ${text}</div>`);$("chat").scrollTop=$("chat").scrollHeight}
function initAI(){if(!$("chat").dataset.ready){$("chat").dataset.ready="1";bot("Hello! I am the CarePlus AI Assistant. Ask me about patients, doctors, appointments or revenue.")}}
function askAI(){
 let input=$("aiInput"),q=input.value.trim();if(!q)return;
 $("chat").insertAdjacentHTML("beforeend",`<div class="msg user">${q}</div>`);input.value="";
 let x=q.toLowerCase(),ans;
 if(x.includes("patient"))ans=`There are currently <b>${data.patients.length}</b> registered patients.`;
 else if(x.includes("doctor"))ans=`There are <b>${data.doctors.length}</b> doctors in the system.`;
 else if(x.includes("appointment"))ans=`There are <b>${data.appointments.length}</b> appointments recorded.`;
 else if(x.includes("revenue")||x.includes("income"))ans=`Total recorded billing revenue is <b>₹${data.bills.reduce((s,b)=>s+Number(b.amount),0).toLocaleString("en-IN")}</b>.`;
 else if(x.includes("help"))ans="You can ask: How many patients? How many doctors? How many appointments? What is revenue?";
 else ans="I can help with basic hospital-system information. Try asking about patients, doctors, appointments, or revenue.";
 setTimeout(()=>bot(ans),250);
}
$("today").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
if(sessionStorage.logged==="1"){$("loginPage").classList.add("hidden");$("app").classList.remove("hidden");renderDashboard()}