const schedule={
  1:{name:'Даваа',lessons:['Хими','Хими','Газар зүй','Газар зүй','Бие тамир','Англи хэл','Англи хэл']},
  2:{name:'Мягмар',lessons:['Англи хэл','Мэдээзүй','Биологи','Биологи','Математик','Математик']},
  3:{name:'Лхагва',lessons:['Нийгэм','Нийгэм','Дизайн','Дизайн','У/М/Ү','Сонгон']},
  4:{name:'Пүрэв',lessons:['Физик','Физик','У/М/Ү','Англи хэл','Ёс зүй','Ёс зүй']},
  5:{name:'Баасан',lessons:['Англи хэл','Түүх','Математик','У/М/Ү','Бие тамир','Эрүүл мэнд','Сонгох']}
};

const mnMonths=['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
const weekNames=['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'];

function lessonCard(name,index){
  return `<div class="lesson"><div class="lesson-no">${index+1}</div><div><div class="lesson-name">${name}</div><div class="lesson-meta">${index+1}-р цаг</div></div></div>`;
}

function setText(id,text){
  const el=document.getElementById(id);
  if(el) el.textContent=text;
}

function renderToday(){
  const now=new Date();
  const day=now.getDay();
  setText('todayDate',`${now.getFullYear()} • ${mnMonths[now.getMonth()]} • ${now.getDate()}`);
  setText('todayDay',weekNames[day]);
  setText('year',now.getFullYear());

  const todayLessons=document.getElementById('todayLessons');
  if(schedule[day]){
    const data=schedule[day];
    setText('todayTitle',`${data.name} гаригийн хичээл`);
    setText('lessonCount',`${data.lessons.length} хичээл`);
    setText('dashboardLessons',`${data.lessons.length} хичээл`);
    setText('todaySummary',`Өнөөдөр ${data.lessons.length} хичээлтэй.`);
    if(todayLessons) todayLessons.innerHTML=data.lessons.map(lessonCard).join('');
  }else{
    setText('todayTitle','Өнөөдөр хичээлгүй');
    setText('lessonCount','Амралтын өдөр');
    setText('dashboardLessons','Амралтын өдөр');
    setText('todaySummary','Өнөөдөр амралтын өдөр байна.');
    if(todayLessons) todayLessons.innerHTML='<div class="empty-state"><div class="empty-icon">✓</div><div><h3>Амралтын өдөр</h3><p>Дараагийн хичээлийн өдрийн хуваарийг Хуваарь хэсгээс харна уу.</p></div></div>';
  }
}

function renderSchedule(day){
  const data=schedule[day];
  const list=document.getElementById('scheduleLessons');
  if(!data||!list) return;
  setText('selectedDayTitle',data.name);
  setText('selectedDayCount',`${data.lessons.length} хичээл`);
  list.innerHTML=data.lessons.map(lessonCard).join('');
}

function renderTabs(){
  const dayTabs=document.getElementById('dayTabs');
  if(!dayTabs) return;
  const currentDay=new Date().getDay();
  const fallback=currentDay>=1&&currentDay<=5?currentDay:1;
  dayTabs.innerHTML='';

  Object.entries(schedule).forEach(([key,data])=>{
    const btn=document.createElement('button');
    btn.className='day-tab'+(Number(key)===fallback?' active':'');
    btn.textContent=data.name;
    btn.type='button';
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.day-tab').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(Number(key));
    });
    dayTabs.appendChild(btn);
  });
  renderSchedule(fallback);
}

const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
if(menuBtn&&nav){
  menuBtn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
  });
}

document.getElementById('printSchedule')?.addEventListener('click',()=>window.print());

renderToday();
renderTabs();
