'use strict';

if (new URLSearchParams(window.location.search).has('capture')) {
  document.body.classList.add('capture-mode');
  document.documentElement.classList.add('capture-mode');
  document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
}


// Replace these two fields when the real name and contact address are ready.
const profile = { name: '박세진', email: '' };
const stories = {
  content: {
    eyebrow: 'DAILY CONTENT / PERSONAL EXPERIMENT', title: '꾸준한 실험이 쌓여, 경험이 되다.', image: 'assets/content.svg', alt: '개인 콘텐츠를 표현하는 임시 썸네일',
    intro: '매일 한 편의 영상을 만들고 유튜브·틱톡·인스타그램에 올리며, 사용자가 무엇에 관심을 보이는지 살펴보고 있습니다.',
    notice: '조회수는 사용자가 제공한 개별 영상의 성과입니다. 썸네일은 임시 이미지이며, 플랫폼별 증빙 화면과 구체적인 변경 사례는 추후 추가할 예정입니다.',
    chapters: [
      ['01 / 시작한 이유', '마케팅을 책이나 강의로만 이해하는 대신, 직접 콘텐츠를 만들어 사람들의 반응을 경험하고 싶었습니다. 하루에 영상 하나를 완성하고 업로드하는 일을 꾸준히 이어가고 있습니다.'],
      ['02 / 나의 역할과 기간', '개인 콘텐츠 기획·제작·업로드와 사용자 반응 관찰. 3주 차까지 운영하며, 정확한 시작일과 제작 도구는 실제 정보로 보완할 예정입니다.'],
      ['03 / 지금까지 확인한 변화', '첫 주에는 조회수가 약 1천 회 내외였고, 3주 차에는 53만 회에 도달한 영상이 나왔습니다. 이 수치는 전체 영상의 평균이나 동일 영상의 시간별 성장을 뜻하지 않습니다.'],
      ['04 / 관찰에서 다음 시도로', '어떤 내용을 좋아하는지, 무엇에 흥미를 보이는지 살펴보며 다음 콘텐츠를 만들어가고 있습니다. 실제로 바꾼 주제·도입부·편집 방식과 그 반응은 사례를 받아 구체화할 예정입니다.'],
      ['05 / 디자인으로 이어지는 배움', '내가 전달하고 싶은 내용만큼, 상대방이 어떻게 받아들이는지도 중요하다는 것을 배우고 있습니다. 사용자의 관심과 행동을 관찰하고 더 나은 경험을 만드는 태도로 이어가고 싶습니다.']
    ]
  },
  app: {
    eyebrow: 'APP EXPERIENCE / SAMPLE PROJECT', title: '잠깐, 나에게', image: 'assets/app.svg', alt: '짧은 휴식 시간을 선택하는 앱 화면 예시',
    intro: '복잡한 준비 없이 짧은 휴식을 시작할 수 있도록 돕는 모바일 앱 기획 예시입니다.',
    notice: '이 프로젝트는 포트폴리오 구조와 설명 방식을 보여주는 가상 예시입니다. 실제 제작 경력·결과·성과를 의미하지 않으며, 사용자의 실제 앱으로 교체할 예정입니다.',
    chapters: [
      ['01 / 기획 의도와 문제 가설', '잠깐 쉬고 싶어도 무엇을 할지 고르는 과정이 길어지면 시작을 미룰 수 있다고 가정했습니다. 많은 콘텐츠를 탐색하기보다, 지금 가능한 시간을 기준으로 선택하도록 설계하는 방향을 제안합니다.'],
      ['02 / 역할 · 기간 · 플랫폼', '기획, 정보 구조, UX/UI 화면 설계의 예시. 기간은 실제 프로젝트 정보로 입력할 예정입니다. 플랫폼은 모바일 앱 프로토타입을 가정했습니다.'],
      ['03 / 컨셉과 정보 구조', '컨셉은 ‘작은 쉼을 쉽게 시작하기’. 홈, 휴식 선택, 진행, 기록의 네 영역으로 나누고, 첫 화면에는 휴식을 시작하는 행동을 우선 배치합니다.'],
      ['04 / 사용자 경험 흐름', '지금의 상태 확인 → 가능한 시간 선택 → 휴식 시작 → 완료 후 기록 확인. 한 화면에서 해야 할 행동이 분명하도록 선택지를 정리합니다.'],
      ['05 / 개선 제안', '처음부터 여러 기능을 보여주기보다 시간 선택을 먼저 제시하고, 설명은 필요한 시점에 보여주는 방향입니다. 이는 설계 제안이며 실제 테스트로 검증된 개선 결과는 아닙니다.'],
      ['06 / 사용성 확인 계획', '‘3분 휴식을 시작해보세요’라는 과제로 시작 버튼을 찾는 과정과 선택의 어려움을 관찰할 예정입니다. 테스트 수행 후 성공 여부, 멈춘 지점, 수정 내용으로 보완합니다.']
    ]
  },
  web: {
    eyebrow: 'WEB DESIGN / SAMPLE REDESIGN', title: '흩어진 정보를, 하나의 흐름으로.', image: 'assets/web-after.svg', alt: '정보 우선순위와 주요 버튼을 정리한 웹 화면 예시',
    intro: '중요한 정보와 다음 행동이 한눈에 들어오도록 구성한 웹 리디자인 예시입니다.',
    notice: '비교 화면은 설명을 위해 제작한 가상 웹 화면입니다. 실제 고객 작업이나 검증된 성과가 아니며, 실제 프로젝트 자료를 받은 뒤 교체할 예정입니다.',
    chapters: [
      ['01 / 프로젝트 개요', '정보가 흩어진 웹페이지를 가정한 개인 리디자인 예시입니다. 기획과 UX/UI 설계의 설명 구조를 보여주며, 실제 담당 역할과 기간은 추후 입력합니다.'],
      ['02 / 문제 가설', '여러 정보가 같은 크기로 나열되면 무엇부터 읽어야 할지 판단하기 어려울 수 있습니다. 주요 버튼이 다른 요소와 비슷하게 표현되면 다음 행동도 놓치기 쉽다고 가정했습니다.'],
      ['03 / 컨셉과 구성', '‘핵심부터, 자연스럽게’. 첫 영역에 목적을 설명하는 제목과 주요 버튼을 배치하고, 관련 정보를 묶어 하나의 읽기 흐름을 제안합니다.'],
      ['04 / 비포에서 애프터로', '여러 개의 동등한 블록 → 핵심 제목과 대표 이미지. 분산된 이동 버튼 → 목적이 분명한 주요 버튼. 긴 정보 나열 → 관련 주제별 묶음으로 변경합니다.'],
      ['05 / 검증할 내용', '방문자가 주요 정보를 찾고 원하는 작업 상세로 이동할 수 있는지 확인할 예정입니다. 실제 테스트 전이므로 탐색 시간 단축이나 만족도 향상을 성과로 제시하지 않습니다.']
    ]
  }
};

const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
let previousFocus = null;

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('span').textContent = '＋';
}
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('span').textContent = isOpen ? '−' : '＋';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function openStory(key, trigger) {
  const story = stories[key];
  if (!story) return;
  previousFocus = trigger;
  dialogContent.replaceChildren();
  const label = element('p', story.eyebrow, 'eyebrow');
  const title = element('h2', story.title);
  title.id = 'dialog-title';
  const intro = element('p', story.intro, 'dialog-copy');
  const cover = element('div', '', 'dialog-cover');
  const image = element('img');
  image.src = story.image;
  image.alt = story.alt;
  cover.append(image);
  dialogContent.append(label, title, intro, cover, element('p', story.notice, 'dialog-notice'));
  story.chapters.forEach(([heading, copy]) => {
    const chapter = element('section', '', 'dialog-chapter');
    chapter.append(element('h3', heading), element('p', copy));
    dialogContent.append(chapter);
  });
  document.body.classList.add('dialog-open');
  dialog.showModal();
  dialog.scrollTop = 0;
  dialog.querySelector('.dialog-close').focus();
}
document.querySelectorAll('[data-project]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const open = () => openStory(trigger.dataset.project, trigger);
    if (window.waterEffects) window.waterEffects.openProject(trigger, open);
    else open();
  });
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  previousFocus?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
function syncMotion() {
  const paused = userPaused || reducedMotion.matches;
  document.body.classList.toggle('motion-paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.querySelector('span').textContent = reducedMotion.matches ? '움직임 줄이기 적용 중' : paused ? '물방울 움직이기' : '물방울 멈추기';
  motionToggle.disabled = reducedMotion.matches;
}
motionToggle.addEventListener('click', () => {
  userPaused = !userPaused;
  try { localStorage.setItem('portfolio-motion-paused', String(userPaused)); } catch { /* The control still works without storage. */ }
  syncMotion();
  document.querySelector('#announcement').textContent = userPaused ? '물방울 움직임을 멈췄습니다.' : '물방울 움직임을 다시 시작합니다.';
});
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

document.querySelector('#contact-button').addEventListener('click', event => {
  if (profile.email) { window.location.href = `mailto:${profile.email}`; return; }
  previousFocus = event.currentTarget;
  dialogContent.replaceChildren();
  const title = element('h2', '연락처를 준비하고 있어요.');
  title.id = 'dialog-title';
  const message = element('p', '현재는 사용성 테스트용 포트폴리오입니다. 실제 이메일 주소를 등록하면 이 버튼에서 바로 메일을 보낼 수 있게 연결할 예정입니다.', 'dialog-copy');
  const link = element('a', 'GitHub 프로필 방문하기 ↗', 'text-link');
  link.href = 'https://github.com/tpwls4470';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  dialogContent.append(title, message, link);
  document.body.classList.add('dialog-open');
  dialog.showModal();
});

const navigationLinks = [...nav.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
document.querySelectorAll('main>section').forEach(section => sectionObserver.observe(section));
document.querySelector('#year').textContent = String(new Date().getFullYear());




