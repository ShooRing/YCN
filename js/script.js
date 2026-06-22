document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================
       1. "YCN은" 메인 비주얼 타이틀 글자 분리 (Split-Text 노드화)
       ========================================================== */
    const splitTarget = document.querySelector('.split-text-target');
    let chars = [];
    
    if (splitTarget) {
        const textContent = splitTarget.textContent.trim();
        splitTarget.textContent = ''; // 기존 텍스트 비우기
        
        // 글자를 배열로 쪼개어 각각 <span> 구조로 삽입
        chars = [...textContent].map(char => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char;
            splitTarget.appendChild(span);
            return span;
        });
    }


    /* ==========================================================
       2. 메인 비주얼 스크롤 인터랙션 (에러 수정 및 타임라인 통합)
       ========================================================== */
    const visualWrapper = document.querySelector(".main-visual-wrapper");
    const zoomImageBox = document.querySelector(".zoom-image-box");
    const scrollFadeUp = document.querySelector(".scroll-fade-up");

    if (visualWrapper && zoomImageBox && scrollFadeUp) {
        window.addEventListener("scroll", () => {
            const rect = visualWrapper.getBoundingClientRect();
            const startScroll = window.pageYOffset + rect.top;
            const duration = visualWrapper.offsetHeight - window.innerHeight;
            const currentScroll = window.pageYOffset - startScroll;

            // 전체 스크롤 진행 상황 비율 연산 (0 ~ 1)
            let progress = Math.min(Math.max(currentScroll / duration, 0), 1);

            /* [구간 A] progress: 0.0 ~ 0.5 ➡️ 우측 하단 이미지가 전체 화면으로 확대 */
            if (progress <= 0.5) {
                let stage1Progress = progress * 2; // 0 ~ 1 매핑
                
                let currentWidth = 400 + (window.innerWidth - 400) * stage1Progress;
                let currentHeight = 550 + (window.innerHeight - 550) * stage1Progress;
                let currentRight = 10 * (1 - stage1Progress);
                let currentBottom = 10 * (1 - stage1Progress);
                let currentRadius = 6 * (1 - stage1Progress);

                zoomImageBox.style.width = `${currentWidth}px`;
                zoomImageBox.style.height = `${currentHeight}px`;
                zoomImageBox.style.right = `${currentRight}%`;
                zoomImageBox.style.bottom = `${currentBottom}%`;
                zoomImageBox.style.borderRadius = `${currentRadius}px`;

                // 상반기 구간에서는 타이틀 글자 및 서브 문구를 대기 상태로 유지
                chars.forEach(span => {
                    span.style.opacity = 0;
                    span.style.transform = 'translateY(30px)';
                });
                scrollFadeUp.style.opacity = 0;
                scrollFadeUp.style.transform = 'translateY(40px)';

            /* [구간 B] progress: 0.5 ~ 1.0 ➡️ 이미지는 풀스크린 고정, 글자가 애니메이션으로 등장 */
            } else {
                zoomImageBox.style.width = "100vw";
                zoomImageBox.style.height = "100vh";
                zoomImageBox.style.right = "0%";
                zoomImageBox.style.bottom = "0%";
                zoomImageBox.style.borderRadius = "0px";

                let stage2Progress = (progress - 0.5) * 2; // 후반 스크롤 진행도 정규화 (0 ~ 1)

                // 타이틀 글자들 순차 등장 연산 (역방향 완벽 대응)
                chars.forEach((span, index) => {
                    const startWeight = index * 0.15; 
                    let charProgress = (stage2Progress - startWeight) / 0.4;
                    if (charProgress < 0) charProgress = 0;
                    if (charProgress > 1) charProgress = 1;

                    span.style.opacity = charProgress;
                    span.style.transform = `translateY(${30 * (1 - charProgress)}px)`;
                });

                // 서브 문구(scroll-fade-up) 떠오르기 효과
                let subProgress = (stage2Progress - 0.4) / 0.6;
                if (subProgress < 0) subProgress = 0;
                if (subProgress > 1) subProgress = 1;

                scrollFadeUp.style.opacity = subProgress;
                scrollFadeUp.style.transform = `translateY(${40 * (1 - subProgress)}px)`;
            }
        });
    }


    /* ==========================================================
       3. 일반 콘텐츠 스크롤 페이드인 (Intersection Observer)
       ========================================================== */
    const fadeElements = document.querySelectorAll('.observe-fade');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

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
       4. Our System 탭 메뉴 마우스 호버(mouseenter) 전환 효과
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