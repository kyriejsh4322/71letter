const issues = {
  68: { label: '68호 · 2026년 1–2월', pages: 6 },
  69: { label: '69호 · 2026년 3–4월', pages: 6 },
  70: { label: '70호 · 2026년 5–6월', pages: 6 },
  71: { label: '71호 · 2026년 7–8월', pages: 8 }
};

const stack = document.querySelector('#page-stack');
const title = document.querySelector('#reader-title');
const count = document.querySelector('#page-count');
const pdfLink = document.querySelector('#pdf-link');
const cards = [...document.querySelectorAll('.issue-card')];

function renderIssue(number, shouldScroll = false) {
  const issue = issues[number];
  stack.classList.add('loading');
  title.textContent = issue.label;
  count.textContent = `${issue.pages} pages`;
  pdfLink.href = `assets/pdf/${number}.pdf`;
  pdfLink.setAttribute('download', `라오스-선교편지-${number}호.pdf`);

  cards.forEach(card => {
    const active = card.dataset.issue === String(number);
    card.classList.toggle('active', active);
    card.setAttribute('aria-pressed', String(active));
  });

  const fragment = document.createDocumentFragment();
  for (let page = 1; page <= issue.pages; page += 1) {
    const image = new Image();
    image.src = `assets/pages/${number}-${page}.jpg`;
    image.alt = `${issue.label}, ${page}쪽`;
    image.loading = page <= 2 ? 'eager' : 'lazy';
    image.decoding = 'async';
    fragment.appendChild(image);
  }
  stack.replaceChildren(fragment);
  stack.classList.remove('loading');
  history.replaceState(null, '', `#issue-${number}`);
  if (shouldScroll) document.querySelector('.reader').scrollIntoView({ behavior: 'smooth' });
}

cards.forEach(card => card.addEventListener('click', () => renderIssue(card.dataset.issue, true)));

const requestedIssue = location.hash.match(/issue-(68|69|70|71)/)?.[1] || '71';
renderIssue(requestedIssue);
