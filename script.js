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

/* ------------------------------
   УХААЛАГ ГЭРИЙН ДААЛГАВАР
-------------------------------- */
const homeworkData=[
  {
    subject:'Хими',
    assigned:'2026-09-14',
    status:'active'
  },
  {
    subject:'Газар зүй',
    assigned:'2026-09-14',
    status:'unknown',
    text:'Даалгавар тодорхойгүй байна.'
  },
  {
    subject:'Англи хэл',
    assigned:'2026-09-14',
    status:'none',
    text:'Даалгавар өгөөгүй.'
  }
];

function localDateFromISO(iso){
  const [y,m,d]=iso.split('-').map(Number);
  return new Date(y,m-1,d);
}

function startOfDay(date){
  return new Date(date.getFullYear(),date.getMonth(),date.getDate());
}

function addDays(date,days){
  const copy=new Date(date);
  copy.setDate(copy.getDate()+days);
  return copy;
}

function formatShortDate(date){
  return `${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
}

function nextLessonDate(subject,assignedISO){
  const assigned=localDateFromISO(assignedISO);
  for(let i=1;i<=14;i++){
    const candidate=addDays(assigned,i);
    const daySchedule=schedule[candidate.getDay()];
    if(daySchedule&&daySchedule.lessons.includes(subject)) return candidate;
  }
  return null;
}

function daysUntil(date){
  const today=startOfDay(new Date());
  const target=startOfDay(date);
  return Math.round((target-today)/86400000);
}

function dueLabel(days,dueDate){
  if(days===0) return '🔴 ӨНӨӨДӨР ӨГНӨ';
  if(days===1) return '🟠 Маргааш өгнө';
  if(days===2||days===3) return `🟡 ${days} өдөр үлдсэн`;
  return `${days} өдөр үлдсэн · ${formatShortDate(dueDate)}`;
}

function statusCard(subject,icon,title,text,badge){
  return `
    <section class="homework-card" style="margin-top:16px" data-generated-homework="true">
      <div class="homework-card-top">
        <div class="subject-icon">${icon}</div>
        <div class="subject-info">
          <div class="subject-kicker">09.14 мэдээлэл</div>
          <h2>${subject}</h2>
          <p>${title}</p>
        </div>
        <div class="task-count">${badge}</div>
      </div>
      <div class="task-list">
        <article class="task-row">
          <div class="page-number">${icon}</div>
          <div class="task-main">
            <strong>${title}</strong>
            <span>${text}</span>
          </div>
          <div class="problem-badge">${badge}</div>
        </article>
      </div>
    </section>`;
}

function renderHomework(){
  const chemistryCard=document.querySelector('.homework-card[aria-labelledby="chemistryTitle"]');
  if(!chemistryCard) return;

  document.querySelectorAll('[data-generated-homework="true"]').forEach(el=>el.remove());

  const chemistry=homeworkData.find(x=>x.subject==='Хими');
  const chemistryDue=nextLessonDate('Хими',chemistry.assigned);
  const chemistryDays=chemistryDue?daysUntil(chemistryDue):null;
  const chemistryBadge=chemistryCard.querySelector('.task-count');

  // Өгөх өдөр бүтэн харагдана. Дараагийн өдрөөс үндсэн жагсаалтаас алга болно.
  if(chemistryDays!==null&&chemistryDays<0){
    chemistryCard.style.display='none';
  }else{
    chemistryCard.style.display='';
    if(chemistryBadge&&chemistryDays!==null){
      chemistryBadge.textContent=dueLabel(chemistryDays,chemistryDue);
    }
  }

  const geography=homeworkData.find(x=>x.subject==='Газар зүй');
  const geoDue=nextLessonDate('Газар зүй',geography.assigned);
  const geoDays=geoDue?daysUntil(geoDue):null;
  if(geoDays===null||geoDays>=0){
    chemistryCard.insertAdjacentHTML('afterend',statusCard(
      'Газар зүй','?','Даалгавар тодорхойгүй',
      geoDue?`Дараагийн Газар зүй ${formatShortDate(geoDue)}. Мэдээллийг дараа нь шинэчилж болно.`:'Мэдээллийг дараа нь шинэчилж болно.',
      'Шалгах'
    ));
  }

  const english=homeworkData.find(x=>x.subject==='Англи хэл');
  const lastGenerated=document.querySelector('[data-generated-homework="true"]:last-of-type')||chemistryCard;
  lastGenerated.insertAdjacentHTML('afterend',statusCard(
    'Англи хэл','✓','Даалгавар өгөөгүй',english.text,'Байхгүй'
  ));
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
renderHomework();
