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
       2. 통합 메인 비주얼 스크롤 인터랙션 (타임라인 병합)
       ========================================================== */
    const wrapper = document.querySelector('.main-visual-wrapper');
    const zoomBox = document.querySelector('.zoom-image-box');
    const subTitle = document.querySelector('.scroll-fade-up');
    const colorOverlay = document.querySelector(".color-overlay");
    const upBoxes = document.querySelectorAll(".up-box");

    if (wrapper && zoomBox) {
        window.addEventListener('scroll', () => {
            const wrapperTop = wrapper.offsetTop;
            const wrapperHeight = wrapper.offsetHeight;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            const startScroll = wrapperTop;
            const endScroll = wrapperTop + wrapperHeight - windowHeight;

            // 메인 비주얼 섹션 전체의 스크롤 진행 비율 (0 ~ 1)
            let progress = (scrollTop - startScroll) / (endScroll - startScroll);
            progress = Math.min(Math.max(progress, 0), 1);

            /* ──────────────────────────────────────────────────
               [구간 1] progress: 0.0 ~ 0.5 (스크롤 상반기)
               => 우측 하단의 작은 사진이 풀스크린으로 확대되는 단계
               ────────────────────────────────────────────────── */
            if (progress <= 0.5) {
                let stage1Progress = progress / 0.5; // 0 ~ 1 매핑

                // 이미지 확대 연산
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

                // 구간 2 및 박스 요소 초기화 (위로 역스크롤 시 대응)
                if (colorOverlay) colorOverlay.style.opacity = 0;
                upBoxes.forEach(box => box.style.transform = "translateY(100vh)");
                chars.forEach(span => {
                    span.style.opacity = 0;
                    span.style.transform = 'translateY(30px)';
                });
                if (subTitle) {
                    subTitle.style.opacity = 0;
                    subTitle.style.transform = 'translateY(40px)';
                }

            /* ──────────────────────────────────────────────────
               [구간 2] progress: 0.5 ~ 1.0 (스크롤 하반기)
               => 사진은 풀스크린 고정, 글자 등장 및 네모 박스 4개 상승
               ────────────────────────────────────────────────── */
            } else {
                // 이미지는 화면 크기로 완전히 고정
                zoomBox.style.width = "100vw";
                zoomBox.style.height = "100vh";
                zoomBox.style.right = "0%";
                zoomBox.style.bottom = "0%";
                zoomBox.style.borderRadius = "0px";

                let stage2Progress = (progress - 0.5) / 0.5; // 0 ~ 1 매핑

                // A. 타이틀 글자들 한 자씩 순차 등장 (0.0 ~ 0.4 구간 활용)
                chars.forEach((span, index) => {
                    const startWeight = index * 0.15; 
                    let charProgress = (stage2Progress - startWeight) / 0.4;
                    charProgress = Math.min(Math.max(charProgress, 0), 1);

                    span.style.opacity = charProgress;
                    span.style.transform = `translateY(${30 * (1 - charProgress)}px)`;
                });

                // B. 서브 문구 떠오르기 효과 (0.4 ~ 1.0 구간 활용)
                if (subTitle) {
                    let subProgress = (stage2Progress - 0.4) / 0.6;
                    subProgress = Math.min(Math.max(subProgress, 0), 1);

                    subTitle.style.opacity = subProgress;
                    subTitle.style.transform = `translateY(${40 * (1 - subProgress)}px)`;
                }

                // C. 바탕 화면을 덮어줄 백그라운드 오버레이 작동
                if (colorOverlay) {
                    colorOverlay.style.opacity = stage2Progress;
                }

                // D. 4분의 1 크기 세로형 박스들이 엇박자로 매끄럽게 컴백 (Stagger 효과)
                upBoxes.forEach((box, index) => {
                    let delay = index * 0.12; // 각 박스가 출발할 딜레이 기준점 연산
                    let individualProgress = (stage2Progress - delay) / (1 - delay);
                    individualProgress = Math.min(Math.max(individualProgress, 0), 1);
                    
                    // 감속 곡선(Cubic Ease-Out) 효과를 수식으로 대입하여 한층 유연하게 상승 연출
                    let easeProgress = 1 - Math.pow(1 - individualProgress, 3); 
                    let translateY = 100 - (easeProgress * 100);

                    box.style.transform = `translateY(${translateY}vh)`;
                });
            }
        });
    }

    /* ==========================================================
       3. 일반 콘텐츠 스크롤 페이드인 (Intersection Observer)
       ========================================================== */
    const fadeElements = document.querySelectorAll('.observe-fade');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin:
