const form = document.querySelector('#letter-form');
const list = document.querySelector('#section-list');
const template = document.querySelector('#section-template');
const preview = document.querySelector('#letter-preview');
const saveState = document.querySelector('#save-state');
const draftKey = 'yojo-letter-writer-v1';
let zoom = .75;

function escapeHTML(value=''){return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function addSection(data={}){
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('.section-title').value=data.title||'';
  node.querySelector('.section-body').value=data.body||'';
  if(data.image){node.dataset.image=data.image;node.querySelector('.image-status').textContent='저장된 사진이 연결되었습니다.'}
  node.querySelector('.remove-section').addEventListener('click',()=>{node.remove();renumber();updatePreview()});
  node.querySelector('.section-image').addEventListener('change',event=>{
    const file=event.target.files[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{node.dataset.image=reader.result;node.querySelector('.image-status').textContent=`${file.name} 선택됨`;updatePreview()};reader.readAsDataURL(file);
  });
  node.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',updatePreview));
  list.append(node);renumber();updatePreview();
}

function renumber(){[...list.children].forEach((section,index)=>section.querySelector('.section-number').textContent=`소식 ${String(index+1).padStart(2,'0')}`)}
function data(){const fd=new FormData(form);return{issue:fd.get('issue'),year:fd.get('year'),period:fd.get('period'),greeting:fd.get('greeting'),intro:fd.get('intro'),financeTitle:fd.get('financeTitle'),finance:fd.get('finance'),contact:fd.get('contact'),sections:[...list.children].map(el=>({title:el.querySelector('.section-title').value,body:el.querySelector('.section-body').value,image:el.dataset.image||''}))}}

function updatePreview(){
  const d=data();
  const stories=d.sections.map((s,i)=>`<section class="preview-story"><h2 class="story-title">${i+1}. ${escapeHTML(s.title||'새로운 소식')}</h2>${s.image?`<img class="story-image" src="${s.image}" alt="${escapeHTML(s.title||'소식 사진')}">`:''}<div class="story-body">${escapeHTML(s.body||'이곳에 소식의 본문이 표시됩니다.')}</div></section>`).join('');
  preview.innerHTML=`<header><div class="preview-brand"><div class="preview-logo">YO-JO</div><div class="preview-slogan">울창한 숲도<br>한 알의 작은 <b>밀알</b>에서 시작됩니다!</div></div><div class="preview-meta"><span>LAOS ${escapeHTML(d.issue||'–')}호</span><span>${escapeHTML(d.year||'')} ${escapeHTML(d.period||'')}</span></div></header><h1 class="preview-greeting">${escapeHTML(d.greeting||'싸바이디,')}</h1><div class="preview-intro">${escapeHTML(d.intro||'여는 글을 입력하면 이곳에 편지의 첫 이야기가 나타납니다.')}</div>${stories||'<p class="empty-hint">왼쪽에서 첫 번째 소식을 추가해 주세요.</p>'}${d.finance?`<section class="preview-finance"><h3>【 ${escapeHTML(d.financeTitle||'재정 보고')} 】</h3><div class="story-body">${escapeHTML(d.finance)}</div></section>`:''}<footer class="preview-contact">${escapeHTML(d.contact||'')}</footer>`;
  saveState.textContent='편집 중';
}

function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify(data()));saveState.textContent='이 기기에 저장됨';setTimeout(()=>saveState.textContent='자동 저장 준비',1600)}catch{saveState.textContent='사진 용량이 커 저장하지 못함'}}
function loadDraft(){const raw=localStorage.getItem(draftKey);if(!raw){addSection({title:'첫 번째 소식'});return}try{const d=JSON.parse(raw);Object.entries(d).forEach(([key,value])=>{if(key!=='sections'&&form.elements[key])form.elements[key].value=value});(d.sections||[]).forEach(addSection);if(!d.sections?.length)addSection();saveState.textContent='저장된 초안 불러옴'}catch{addSection()}}

form.addEventListener('input',updatePreview);
document.querySelector('#add-section').addEventListener('click',()=>addSection());
document.querySelector('#save-btn').addEventListener('click',saveDraft);
document.querySelector('#print-btn').addEventListener('click',()=>window.print());
document.querySelector('#reset-btn').addEventListener('click',()=>{if(confirm('현재 작성 내용을 지우고 새 편지를 시작할까요?')){localStorage.removeItem(draftKey);location.reload()}});
document.querySelector('#zoom-in').addEventListener('click',()=>{zoom=Math.min(1,zoom+.1);applyZoom()});
document.querySelector('#zoom-out').addEventListener('click',()=>{zoom=Math.max(.45,zoom-.1);applyZoom()});
function applyZoom(){preview.style.transform=`scale(${zoom})`;document.querySelector('#zoom-label').textContent=`${Math.round(zoom*100)}%`;preview.parentElement.style.setProperty('--zoom',zoom)}
setInterval(()=>{if(saveState.textContent==='편집 중')saveDraft()},30000);
loadDraft();applyZoom();updatePreview();

