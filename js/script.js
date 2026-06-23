document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================
       1. "YCN은" 메인 비주얼 타이틀 글자 분리 (Split-Text 노드화)
       ========================================================== */
    const splitTarget = document.querySelector('.split-text-target');
    let chars = [];
    
    if (splitTarget) {
        const textContent = splitTarget.textContent.trim();
        splitTarget.textContent = '';
        
        chars = [...textContent].map(char => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char;
            splitTarget.appendChild(span);
            return span;
        });
    }

    /* ==========================================================
       2. 메인 비주얼 스크롤 인터랙션 (7단계 기획 완벽 윤활 보정)
       ========================================================== */
    const visualWrapper = document.querySelector(".main-visual-wrapper");
    const zoomBox = document.querySelector(".zoom-image-box");
    const blackMask = document.querySelector(".black-mask-layer");
    const whiteGradient = document.querySelector(".white-gradient-layer");
    const marqueeWrap = document.querySelector(".final-marquee-wrap");
    const scrollFadeUp = document.querySelector(".scroll-fade-up");

    if (visualWrapper && zoomBox && blackMask && whiteGradient && marqueeWrap && scrollFadeUp) {
        window.addEventListener("scroll", () => {
            const wrapperTop = visualWrapper.offsetTop;
            const wrapperHeight = visualWrapper.offsetHeight;
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            const startScroll = wrapperTop;
            const endScroll = wrapperTop + wrapperHeight - windowHeight;

            let progress = (scrollTop - startScroll) / (endScroll - startScroll);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

 /* --------------------------------------------------------
               [1~2단계] progress 0.0 ~ 0.25 : 우측 사진 가변 확대
               -------------------------------------------------------- */
            if (progress <= 0.25) {
                let stepProgress = progress / 0.25;

                let currentWidth = 350 + (window.innerWidth - 350) * stepProgress;
                let currentHeight = 450 + (window.innerHeight - 450) * stepProgress;
                let currentRight = 5 * (1 - stepProgress);
                let currentBottom = 10 * (1 - stepProgress);
                let currentRadius = 6 * (1 - stepProgress);

                zoomBox.style.width = `${currentWidth}px`;
                zoomBox.style.height = `${currentHeight}px`;
                zoomBox.style.right = `${currentRight}%`;
                zoomBox.style.bottom = `${currentBottom}%`;
                zoomBox.style.borderRadius = `${currentRadius}px`;

                // [보정] 1~2단계에서는 #333 레이어 완벽 가림
                blackMask.style.opacity = "0";
                blackMask.style.visibility = "hidden";
                whiteGradient.style.top = "100%";
                marqueeWrap.style.display = "none";
                chars.forEach(span => { span.style.opacity = 0; span.style.transform = 'translateY(30px)'; });
                scrollFadeUp.style.opacity = 0; scrollFadeUp.style.transform = 'translateY(40px)';
            }
            
            /* --------------------------------------------------------
               [3단계] progress 0.25 ~ 0.45 : 사진 배경 위 글자 순차 노출
               -------------------------------------------------------- */
            else if (progress > 0.25 && progress <= 0.45) {
                zoomBox.style.width = "100vw"; zoomBox.style.height = "100vh"; zoomBox.style.right = "0%"; zoomBox.style.bottom = "0%"; zoomBox.style.borderRadius = "0px";
                
                // [보정] 3단계에서도 #333 레이어 완벽 가림 (첫 접속 및 역방향 스크롤 대응)
                blackMask.style.opacity = "0";
                blackMask.style.visibility = "hidden";
                whiteGradient.style.top = "100%";
                marqueeWrap.style.display = "none";

                let stepProgress = (progress - 0.25) / 0.20;

                chars.forEach((span, index) => {
                    const weight = index * 0.15;
                    let charProg = (stepProgress - weight) / 0.4;
                    charProg = Math.min(Math.max(charProg, 0), 1);
                    span.style.opacity = charProg;
                    span.style.transform = `translateY(${30 * (1 - charProg)}px)`;
                });

                let subProg = (stepProgress - 0.4) / 0.6;
                subProg = Math.min(Math.max(subProg, 0), 1);
                scrollFadeUp.style.opacity = subProg;
                scrollFadeUp.style.transform = `translateY(${40 * (1 - subProg)}px)`;
            }

            /* --------------------------------------------------------
               [4~5단계] progress 0.45 ~ 0.70 : #333 4단 스태거식 정밀 상승
               -------------------------------------------------------- */
            else if (progress > 0.45 && progress <= 0.70) {
                zoomBox.style.width = "100vw"; zoomBox.style.height = "100vh"; zoomBox.style.right = "0%"; zoomBox.style.bottom = "0%"; zoomBox.style.borderRadius = "0px";
                whiteGradient.style.top = "100%";
                marqueeWrap.style.display = "none";

                // [보정] 4단계 구간에 진입하는 순간에만 활성화하여 화면에 노출
                blackMask.style.opacity = "1";
                blackMask.style.visibility = "visible";
                blackMask.style.top = "0%";

                let stepProgress = (progress - 0.45) / 0.25;

                let y1 = 100 - Math.min(Math.max(stepProgress * 1.5, 0), 1) * 100;
                let y2 = 100 - Math.min(Math.max((stepProgress - 0.2) * 1.5, 0), 1) * 100;
                let y3 = 100 - Math.min(Math.max((stepProgress - 0.4) * 1.5, 0), 1) * 100;
                let y4 = 100 - Math.min(Math.max((stepProgress - 0.6) * 1.5, 0), 1) * 100;

                blackMask.style.clipPath = `polygon(
                    0% ${y1}%, 25% ${y1}%, 
                    25% ${y2}%, 50% ${y2}%, 
                    50% ${y3}%, 75% ${y3}%, 
                    75% ${y4}%, 100% ${y4}%, 
                    100% 100%, 0% 100%
                )`;
            }
/* --------------------------------------------------------
               [6~7단계] progress 0.70 ~ 1.0 : #333 유지(텀) ➔ 하얀 그라데이션 차오름 ➔ "글자" 마키 완벽 탈출
               -------------------------------------------------------- */
            else if (progress > 0.70) {
                zoomBox.style.width = "100vw"; zoomBox.style.height = "100vh"; zoomBox.style.right = "0%"; zoomBox.style.bottom = "0%"; zoomBox.style.borderRadius = "0px";
                blackMask.style.top = "0%";
                blackMask.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

                let stepProgress = (progress - 0.70) / 0.30; 

                // 스크롤 한 번 정도의 텀 구현 구간 (stepProgress 0.35까지 흑색 홀딩)
                if (stepProgress <= 0.35) {
                    whiteGradient.style.top = "100%";
                    marqueeWrap.style.display = "none";
                } 
                else {
                    let actualProgress = (stepProgress - 0.35) / (1 - 0.35);

                    /* 6단계: 화이트 그라데이션 상승 (타점 0.3 지정) */
                    let gridTarget = 0.3; 
                    let gradProgress = actualProgress / gridTarget;
                    if (gradProgress > 1) gradProgress = 1;
                    let gradTop = 100 - (gradProgress * 100);
                    whiteGradient.style.top = `${gradTop}%`;

                    /* 7단계: 최종 마키 무빙 (화면 밖으로 완벽 탈출) */
                    if (actualProgress >= gridTarget) {
                        marqueeWrap.style.display = "block";
                        
                        let marqueeProgress = (actualProgress - gridTarget) / (1 - gridTarget);
                        
                        // [최종 보정] 이동 거리를 250vw로 확장하여 글자 전체가 화면 왼쪽 문방 밖으로 100% 완전히 빠져나가게 만듭니다.
                        marqueeWrap.style.left = "0%";
                        marqueeWrap.style.transform = `translate3d(${100 - (marqueeProgress * 250)}vw, -50%, 0)`;
                    } else {
                        marqueeWrap.style.display = "none";
                    }
                }
            }
        });
    }

    /* ==========================================================
       3. 일반 콘텐츠 스크롤 페이드인 (Intersection Observer)
       ========================================================== */
    const fadeElements = document.querySelectorAll('.observe-fade');
    const fadeObserverOptions = { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, fadeObserverOptions);
    fadeElements.forEach(el => fadeObserver.observe(el));

    /* ==========================================================
       4. Our System 탭 메뉴 마우스 호버(mouseenter) 효과
       ========================================================== */
    const tabMenuItems = document.querySelectorAll('.tab-menu li');
    const tabContents = document.querySelectorAll('.tab-content-box');

    tabMenuItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            e.preventDefault();
            tabMenuItems.forEach(tab => tab.classList.remove('active'));
            item.classList.add('active');
            const targetTabId = item.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === targetTabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    /* ==========================================================
       5. GNB 햄버거 메뉴 토글 로직
       ========================================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('all-open');
            header.classList.toggle('all-menu-mode');
        });
    }
});