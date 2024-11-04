const shapes = document.querySelectorAll('.shape');
        const followSpeed = 0.05; // 움직임 속도
        const bounceSpeed = 0.5; // 튕길 때의 속도
        const mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const gridRows = 5; // 그리드의 행 수
        let isGrided = false; // 그리드 상태
    
        function initializeShapes() {
            const positions = [];
            shapes.forEach((shape, index) => {
                let posX, posY;
                let isOverlapping;
    
                do {
                    posX = Math.random() * (window.innerWidth - shape.offsetWidth);
                    posY = Math.random() * (window.innerHeight - shape.offsetHeight - 100); // 상단 글자 아래에 위치하도록 수정
                    isOverlapping = false;
    
                    for (let i = 0; i < positions.length; i++) {
                        const [otherX, otherY] = positions[i];
                        const distance = Math.sqrt(Math.pow(posX - otherX, 2) + Math.pow(posY - otherY, 2));
                        // 도형의 stroke가 만났을 때 (겹쳤을 때의 거리 기준)
                        if (distance < (shape.offsetWidth / 2 + shapes[i].offsetWidth / 2)) {
                            isOverlapping = true;
                            break;
                        }
                    }
                } while (isOverlapping);
    
                positions.push([posX, posY]);
                shape.style.left = `${posX}px`;
                shape.style.top = `${posY}px`;
            });
        }
    
        function moveShapes() {
            if (!isGrided) { // 그리드 상태가 아닐 때만 이동
                shapes.forEach(shape => {
                    let posX = parseFloat(shape.style.left);
                    let posY = parseFloat(shape.style.top);
    
                    const dx = mousePosition.x - posX;
                    const dy = mousePosition.y - posY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
    
                    // 마우스와의 거리가 100px 이하일 때만 따라가도록 함
                    if (distance < 150) {
                        posX += dx * followSpeed;
                        posY += dy * followSpeed;
                        shape.style.left = `${posX}px`;
                        shape.style.top = `${posY}px`;
                    }
    
                    // 충돌 체크
                    shapes.forEach(otherShape => {
                        if (shape !== otherShape) {
                            const otherPosX = parseFloat(otherShape.style.left);
                            const otherPosY = parseFloat(otherShape.style.top);
                            const otherDistance = Math.sqrt(Math.pow(posX - otherPosX, 2) + Math.pow(posY - otherPosY, 2));
    
                            // 도형의 stroke가 만났을 때
                            if (otherDistance < (shape.offsetWidth / 2 + otherShape.offsetWidth / 2)) {
                                // 튕기기
                                posX += (shape.offsetWidth / 2 + otherShape.offsetWidth / 2 - otherDistance) * bounceSpeed * (dx > 0 ? -1 : 1);
                                posY += (shape.offsetWidth / 2 + otherShape.offsetWidth / 2 - otherDistance) * bounceSpeed * (dy > 0 ? -1 : 1);
                                shape.style.left = `${posX}px`;
                                shape.style.top = `${posY}px`;
                            }
                        }
                    });
                });
            }
        }
    
        function arrangeShapesInGrid() {
            const shapeTypes = {
                circle: Array.from(shapes).slice(0, 3),
                ellipse: Array.from(shapes).slice(3, 6),
                square: Array.from(shapes).slice(6, 10),
                rectangle: Array.from(shapes).slice(10, 12),
                triangle: Array.from(shapes).slice(12, 15),
            };
    
            const rowHeight = 200; // 각 행의 높이
    
            // 각 도형을 그리드에 정렬
            let rowIndex = 0;
            let colIndex = 0;
            const shapeWidth = 220; // 도형의 너비 (정사각형 기준)
    
            for (const [shapeType, shapesArray] of Object.entries(shapeTypes)) {
                shapesArray.forEach((shape, index) => {
                    shape.style.left = `${colIndex * shapeWidth + 50}px`;
                    shape.style.top = `${rowIndex * rowHeight + 230}px`; // 상단 글자 아래에 위치
                    colIndex++;
    
                    // 그리드 열 수 초과 시 다음 행으로 이동
                    if (colIndex >= gridRows) {
                        colIndex = 0;
                        rowIndex++;
                    }
                });
                rowIndex++; // 다음 행으로 넘어감
                colIndex = 0; // 열 초기화
            }
        }
    
        // 스크롤과 .main-section 제어 함수
        function toggleGridState() {
            const body = document.body;
            const mainSection = document.querySelector('.main-section');
            
            if (isGrided) {
                body.style.overflow = 'auto'; // 스크롤 활성화
                mainSection.style.visibility = 'visible'; // 정렬되면 보이게
            } else {
                body.style.overflow = 'hidden'; // 스크롤 비활성화
                mainSection.style.visibility = 'hidden'; // 흩어지면 숨기기
            }
        }
        
        document.querySelector('.grid-button').addEventListener('click', function() {
            isGrided = !isGrided;
            this.textContent = isGrided ? 'SCATTER' : 'GRID';
    
            if (isGrided) {
                arrangeShapesInGrid();
            } else {
                initializeShapes();
            }
            toggleGridState(); // 스크롤 및 .main-section 상태 제어
        });
    
        window.addEventListener('mousemove', (e) => {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        });
    
        // 초기 도형 위치 설정
        initializeShapes();
    
        // 애니메이션 루프 시작
        function animate() {
            moveShapes();
            requestAnimationFrame(animate);
        }
    
        animate();

        document.querySelector('.home-button').addEventListener('click', function() {
            const nav = document.querySelector('nav'); // nav 요소 선택
            nav.scrollIntoView({ behavior: 'smooth' }); // nav 위치로 부드럽게 스크롤
        });

        const moveOutAll = (clickedContainer, type) => {
            const containers = document.querySelectorAll('.container1, .container2, .container3, .container4, .container5');
            let lastIndex = containers.length - 1;

            // 클릭한 도형을 화면 밖으로 이동
            clickedContainer.style.transform = 'translateX(-200vw)';

            containers.forEach((container, index) => {
                if (container !== clickedContainer) {{}
                    setTimeout(() => {
                        container.style.transform = 'translateX(-200vw)';
                    }, index * 50);
                }
                })
                
                document.querySelector('.container6').style.opacity = 1;
                if (type === 'flower') {
                    document.querySelector('.container7').style.opacity = 1; // flower 클릭 시 container7 보이게 함
                    document.querySelector('.container6').style.opacity = 0;
                    document.querySelector('.container8').style.opacity = 0;
                    document.querySelector('.container9').style.opacity = 0;
                    document.querySelector('.container10').style.opacity = 0;
                if (type === 'tree') {
                    document.querySelector('.container8').style.opacity = 1; // flower 클릭 시 container7 보이게 함
                    document.querySelector('.container7').style.opacity = 0;
                    document.querySelector('.container6').style.opacity = 0;
                    document.querySelector('.container9').style.opacity = 0;
                    document.querySelector('.container10').style.opacity = 0;
                if (type === 'yaza') {
                    document.querySelector('.container9').style.opacity = 1; // flower 클릭 시 container7 보이게 함
                    document.querySelector('.container7').style.opacity = 0;
                    document.querySelector('.container6').style.opacity = 0;
                    document.querySelector('.container8').style.opacity = 0;
                    document.querySelector('.container10').style.opacity = 0;
                if (type === 'seed') {
                    document.querySelector('.container10').style.opacity = 1; // flower 클릭 시 container7 보이게 함
                    document.querySelector('.container7').style.opacity = 0;
                    document.querySelector('.container6').style.opacity = 0;
                    document.querySelector('.container8').style.opacity = 0;
                    document.querySelector('.container9').style.opacity = 0;
            };
            };
            };
            };
        };

        // 각 도형에 클릭 이벤트 추가
        document.querySelector('.cactus').addEventListener('click', () => moveOutAll(document.querySelector('.container1'), 'cactus'));
        document.querySelector('.flower').addEventListener('click', () => moveOutAll(document.querySelector('.container2'), 'flower'));
        document.querySelector('.tree').addEventListener('click', () => moveOutAll(document.querySelector('.container3'), 'tree'));
        document.querySelector('.yaza').addEventListener('click', () => moveOutAll(document.querySelector('.container4'), 'yaza'));
        document.querySelector('.seed').addEventListener('click', () => moveOutAll(document.querySelector('.container5'), 'seed'));

        document.getElementById("reload").addEventListener("click", function() {
            location.reload(); // 페이지 새로고침
        });

        