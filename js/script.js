document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================
       1. "YCN은" 메인 비주얼 타이틀 글자 분리 (텍스트 노드화)
       ========================================================== */
    const splitTarget = document.querySelector('.split-text-target');
    let chars = [];
    
    if (splitTarget) {
        const textContent = splitTarget.textContent.trim();
        splitTarget.textContent = ''; // 기존 텍스트 초기화
        
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
       2. 메인 비주얼 스크롤 애니메이션 (사진 확대 & 글자 유기적 연동)
       ========================================================== */
    const wrapper = document.querySelector('.main-visual-wrapper');
    const zoomBox = document.querySelector('.zoom-image-box');
    const subTitle = document.querySelector('.scroll-fade-up');

    if (wrapper && zoomBox && subTitle) {
        window.addEventListener('scroll', () => {
            const wrapperTop = wrapper.offsetTop;
            const wrapperHeight = wrapper.offsetHeight;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            const startScroll = wrapperTop;
            const endScroll = wrapperTop + wrapperHeight - windowHeight;

            // 메인 비주얼 섹션 전체의 스크롤 진행 비율 (0 ~ 1)
            let progress = (scrollTop - startScroll) / (endScroll - startScroll);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            /* [구간 1] progress: 0.0 ~ 0.5 ➡️ 우측 사진이 풀스크린으로 확대되는 단계 */
            let stage1Progress = progress / 0.5; 
            if (stage1Progress > 1) stage1Progress = 1;

            const currentWidth = 400 + (window.innerWidth - 400) * stage1Progress;
            const currentHeight = 550 + (window.innerHeight - 550) * stage1Progress;
            const currentRight = 10 * (1 - stage1Progress);
            const currentBottom = 10 * (1 - stage1Progress);
            const currentRadius = 6 * (1 - stage1Progress);

            zoomBox.style.width = `${currentWidth}px`;
            zoomBox.style.height = `${currentHeight}px`;
            zoomBox.style.right = `${currentRight}%`;
            zoomBox.style.bottom = `${currentBottom}%`;
            zoomBox.style.borderRadius = `${currentRadius}px`;

            /* [구간 2] progress: 0.5 ~ 1.0 ➡️ 사진 고정 후 글자가 떠오르는 단계 */
            if (progress >= 0.5) {
                let stage2Progress = (progress - 0.5) / 0.5; // 0 ~ 1 매핑
                
                // A. 타이틀 글자들 한 자씩 순차 등장 연산 (역방향 완벽 대응)
                chars.forEach((span, index) => {
                    const startWeight = index * 0.15; 
                    let charProgress = (stage2Progress - startWeight) / 0.4;
                    if (charProgress < 0) charProgress = 0;
                    if (charProgress > 1) charProgress = 1;

                    span.style.opacity = charProgress;
                    span.style.transform = `translateY(${30 * (1 - charProgress)}px)`;
                });

                // B. 서브 문구 떠오르기 효과
                let subProgress = (stage2Progress - 0.4) / 0.6;
                if (subProgress < 0) subProgress = 0;
                if (subProgress > 1) subProgress = 1;

                subTitle.style.opacity = subProgress;
                subTitle.style.transform = `translateY(${40 * (1 - subProgress)}px)`;

            } else {
                // 스크롤을 다시 위로 올렸을 때 초기화 처리
                chars.forEach(span => {
                    span.style.opacity = 0;
                    span.style.transform = 'translateY(30px)';
                });
                subTitle.style.opacity = 0;
                subTitle.style.transform = 'translateY(40px)';
            }
        });
    }


    /* ==========================================================
       3. 일반 콘텐츠 스크롤 페이드인 (Intersection Observer)
       ========================================================== */
    const fadeElements = document.querySelectorAll('.observe-fade');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // 뷰포트 하단 100px 전 미리 감지
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 한 번 등장 후 관찰 해제
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

            // 모든 탭 active 클래스 초기화 후 현재 활성화
            tabMenuItems.forEach(tab => tab.classList.remove('active'));
            item.classList.add('active');

            const targetTabId = item.getAttribute('data-tab');

            // 타겟 콘텐츠만 active 노출 처리
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
            menuToggle.classList.toggle('all-open');      // X자 모션 토글
            header.classList.toggle('all-menu-mode');  // 전체 메뉴 풀다운 클래스 토글
        });
    }

});