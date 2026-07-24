```javascript
/* =========================================================
   NEWS.JS
   ---------------------------------------------------------
   news.html과 같은 폴더에 위치
   Firebase Firestore의 "news" 컬렉션을 불러와
   News 목록 카드 생성 및 상세페이지 연결
========================================================= */


/* =========================================================
   1. FIREBASE IMPORT
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   2. FIREBASE CONFIG
   ---------------------------------------------------------
   기존 상세페이지에서 사용하던 Firebase Config와 동일
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyD_d4etBdBcvBRhTJlD3cLssN309LAdlfg",

    authDomain:
        "yuri-research-portfolio.firebaseapp.com",

    projectId:
        "yuri-research-portfolio",

    storageBucket:
        "yuri-research-portfolio.firebasestorage.app",

    messagingSenderId:
        "231317507996",

    appId:
        "1:231317507996:web:9773282c138706d886c259",

    measurementId:
        "G-57VHW2454"

};


/* =========================================================
   3. FIREBASE INITIALIZE
========================================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   4. NEWS 목록을 표시할 영역 찾기
   ---------------------------------------------------------
   news.html에 아래와 같은 요소가 있어야 합니다.

   <div id="newsContainer"></div>

   만약 현재 news.html의 카드 영역 ID가 다르면
   아래 "newsContainer"만 실제 ID로 변경하세요.
========================================================= */

const newsContainer =
    document.getElementById(
        "newsContainer"
    );


/* =========================================================
   5. NEWS DATA LOAD
========================================================= */

async function loadNews() {

    try {

        console.log(
            "===================================="
        );

        console.log(
            "NEWS FIREBASE LOAD START"
        );

        console.log(
            "===================================="
        );


        /* ---------------------------------------------
           News Container 확인
        --------------------------------------------- */

        if (!newsContainer) {

            console.error(
                "❌ #newsContainer 요소를 찾을 수 없습니다."
            );

            return;

        }


        /* ---------------------------------------------
           news 컬렉션 참조
        --------------------------------------------- */

        const newsRef =
            collection(
                db,
                "news"
            );


        /* ---------------------------------------------
           Firebase 데이터 가져오기
        --------------------------------------------- */

        const snapshot =
            await getDocs(
                newsRef
            );


        console.log(
            "Firebase 문서 개수:",
            snapshot.size
        );


        /* ---------------------------------------------
           기존 카드 비우기
        --------------------------------------------- */

        newsContainer.innerHTML = "";


        /* ---------------------------------------------
           데이터가 없는 경우
        --------------------------------------------- */

        if (snapshot.empty) {

            newsContainer.innerHTML = `
                <p class="no-news">
                    No news yet.
                </p>
            `;

            return;

        }


        /* ---------------------------------------------
           각 News 문서 생성
        --------------------------------------------- */

        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();

                const newsId =
                    docSnapshot.id;


                console.log(
                    "------------------------------------"
                );

                console.log(
                    "문서 ID:",
                    newsId
                );

                console.log(
                    "문서 데이터:",
                    data
                );

                console.log(
                    "------------------------------------"
                );


                /* -----------------------------------------
                   Firebase 필드값
                ----------------------------------------- */

                const title =
                    data.title ||
                    data.heroTitleTop ||
                    "Untitled News";


                const description =
                    data.description ||
                    data.introText ||
                    "";


                const image =
                    data.heroImage ||
                    "images/default-news.jpg";


                const category =
                    data.category ||
                    "NEWS";


                const date =
                    data.date ||
                    data.createdAt ||
                    "";


                /* -----------------------------------------
                   카드 생성
                ----------------------------------------- */

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "news-card";


                /* -----------------------------------------
                   카드 HTML
                ----------------------------------------- */

                card.innerHTML = `

                    <a
                        href="news-detail.html?id=${encodeURIComponent(newsId)}"
                        class="news-card-link"
                    >

                        <div class="news-card-image">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                loading="lazy"
                            >

                        </div>


                        <div class="news-card-content">

                            <span class="news-card-category">
                                ${escapeHTML(category)}
                            </span>


                            <h3 class="news-card-title">
                                ${escapeHTML(title)}
                            </h3>


                            ${
                                description
                                ?
                                `
                                <p class="news-card-description">
                                    ${escapeHTML(description)}
                                </p>
                                `
                                :
                                ""
                            }


                            ${
                                date
                                ?
                                `
                                <span class="news-card-date">
                                    ${escapeHTML(date)}
                                </span>
                                `
                                :
                                ""
                            }

                        </div>

                    </a>

                `;


                /* -----------------------------------------
                   카드 삽입
                ----------------------------------------- */

                newsContainer.appendChild(
                    card
                );

            }
        );


        console.log(
            "✅ News cards successfully loaded."
        );


    } catch (error) {

        console.error(
            "❌ Firebase News Load Error:",
            error
        );


        if (newsContainer) {

            newsContainer.innerHTML = `

                <p class="news-error">
                    Unable to load news.
                </p>

            `;

        }

    }

}


/* =========================================================
   6. HTML 특수문자 처리
   ---------------------------------------------------------
   Firebase에서 가져온 텍스트가 HTML 구조를 깨뜨리지
   않도록 처리
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   7. 실행
========================================================= */

loadNews();
```
