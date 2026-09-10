const schedule={
  1:{name:'Даваа',lessons:['Хими','Хими','Газар зүй','Газар зүй','Бие тамир','Англи хэл','Англи хэл']},
  2:{name:'Мягмар',lessons:['Англи хэл','Мэдээзүй','Биологи','Биологи','Математик','Математик']},
  3:{name:'Лхагва',lessons:['Нийгэм','Нийгэм','Дизайн','Дизайн','У/М/Ү','Сонгон']},
  4:{name:'Пүрэв',lessons:['Физик','Физик','У/М/Ү','Англи хэл','Ёс зүй','Ёс зүй']},
  5:{name:'Баасан',lessons:['Англи хэл','Түүх','Математик','У/М/Ү','Бие тамир','Эрүүл мэнд','Сонгох']}
};

const mnMonths=['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
const weekNames=['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'];

const todayLessons=document.getElementById('todayLessons');
const lessonCount=document.getElementById('lessonCount');
const todayTitle=document.getElementById('todayTitle');
const dayTabs=document.getElementById('dayTabs');
const scheduleLessons=document.getElementById('scheduleLessons');
const selectedDayTitle=document.getElementById('selectedDayTitle');
const selectedDayCount=document.getElementById('selectedDayCount');

function lessonCard(name,index){
  return `<div class="lesson"><div class="lesson-no">${index+1}</div><div><div class="lesson-name">${name}</div><div class="lesson-meta">${index+1}-р цаг</div></div></div>`;
}

function renderToday(){
  const now=new Date();
  const day=now.getDay();
  document.getElementById('todayDate').textContent=`${now.getFullYear()} • ${mnMonths[now.getMonth()]} • ${now.getDate()}`;
  document.getElementById('todayDay').textContent=weekNames[day];
  document.getElementById('year').textContent=now.getFullYear();

  if(schedule[day]){
    const data=schedule[day];
    todayTitle.textContent=`${data.name} гаригийн хичээл`;
    lessonCount.textContent=`${data.lessons.length} хичээл`;
    todayLessons.innerHTML=data.lessons.map(lessonCard).join('');
  }else{
    todayTitle.textContent='Өнөөдөр хичээлгүй';
    lessonCount.textContent='Амралтын өдөр';
    todayLessons.innerHTML='<div class="empty-state"><div class="empty-icon">✓</div><div><h3>Амралтын өдөр</h3><p>Дараагийн хичээлийн өдрийн хуваарийг доороос харна уу.</p></div></div>';
  }
}

function renderTabs(){
  const currentDay=new Date().getDay();
  const fallback=currentDay>=1&&currentDay<=5?currentDay:1;
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

function renderSchedule(day){
  const data=schedule[day];
  selectedDayTitle.textContent=data.name;
  selectedDayCount.textContent=`${data.lessons.length} хичээл`;
  scheduleLessons.innerHTML=data.lessons.map(lessonCard).join('');
}

const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
menuBtn.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
}));

renderToday();
renderTabs();
