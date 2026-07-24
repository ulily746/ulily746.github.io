/* =========================================================
   NEWS.JS
   ---------------------------------------------------------
   news.html과 같은 폴더에 위치

   역할
   1. Firebase news 컬렉션 불러오기
   2. 최신 News 카드 표시
   3. 최대 표시 개수 유지
   4. 선택한 디자인 템플릿으로 상세페이지 연결
   5. Firebase 문서 ID를 상세페이지에 전달
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
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   2. FIREBASE CONFIG
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
   4. SETTINGS
========================================================= */

/*
   News 페이지에 표시할 최대 카드 개수

   예:
   6개만 유지하고 싶으면 6
*/

const MAX_NEWS_COUNT = 6;


/* =========================================================
   5. NEWS CONTAINER
========================================================= */

const newsContainer =
    document.getElementById(
        "newsContainer"
    );


/* =========================================================
   6. DESIGN TEMPLATE ROUTER
   ---------------------------------------------------------
   Firebase에 저장된 디자인 값을 기준으로
   해당 상세페이지 HTML 파일을 선택
========================================================= */

function getTemplatePath(data) {


    const template =
        String(
            data.template ||
            data.design ||
            data.templateName ||
            ""
        ).toLowerCase();


    /* ---------------------------------------------
       Childhood 디자인
    --------------------------------------------- */

    if (
        template === "childhood" ||
        template === "childhood.html" ||
        template === "design1" ||
        template === "design01"
    ) {

        return "FilmArchiveDesign.html";

    }


    /* ---------------------------------------------
       디자인 2
       실제 파일명에 맞게 수정
    --------------------------------------------- */

    if (
        template === "design2" ||
        template === "design02"
    ) {

        return "design02.html";

    }


    /* ---------------------------------------------
       디자인 3
    --------------------------------------------- */

    if (
        template === "design3" ||
        template === "design03"
    ) {

        return "design03.html";

    }


    /* ---------------------------------------------
       디자인 4
    --------------------------------------------- */

    if (
        template === "design4" ||
        template === "design04"
    ) {

        return "design04.html";

    }


    /* ---------------------------------------------
       디자인 5
    --------------------------------------------- */

    if (
        template === "design5" ||
        template === "design05"
    ) {

        return "design05.html";

    }


    /*
       디자인 정보가 없을 경우
       기본 상세페이지
    */

    return "news-detail.html";

}


/* =========================================================
   7. NEWS LOAD
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
           Container 확인
        --------------------------------------------- */

        if (!newsContainer) {

            console.error(
                "❌ #newsContainer 요소를 찾을 수 없습니다."
            );

            return;

        }


        /* ---------------------------------------------
           Firebase Collection
        --------------------------------------------- */

        const newsRef =
            collection(
                db,
                "news"
            );


        /* ---------------------------------------------
           데이터 가져오기
        --------------------------------------------- */

        const snapshot =
            await getDocs(
                newsRef
            );


        console.log(
            "Firebase 전체 문서 개수:",
            snapshot.size
        );


        /* ---------------------------------------------
           데이터를 배열로 변환
        --------------------------------------------- */

        let newsList =
            snapshot.docs.map(
                (docSnapshot) => {

                    return {

                        id:
                            docSnapshot.id,

                        data:
                            docSnapshot.data()

                    };

                }
            );


        /* ---------------------------------------------
           최신순 정렬

           createdAt이 있으면
           createdAt 기준

           없으면 date 기준
        --------------------------------------------- */

        newsList.sort(
            (a, b) => {

                const dateA =
                    getDateValue(
                        a.data
                    );

                const dateB =
                    getDateValue(
                        b.data
                    );


                return dateB - dateA;

            }
        );


        /* ---------------------------------------------
           최신 N개만 표시
        --------------------------------------------- */

        newsList =
            newsList.slice(
                0,
                MAX_NEWS_COUNT
            );


        console.log(
            "현재 표시할 News 개수:",
            newsList.length
        );


        /* ---------------------------------------------
           기존 카드 제거
        --------------------------------------------- */

        newsContainer.innerHTML = "";


        /* ---------------------------------------------
           데이터 없음
        --------------------------------------------- */

        if (
            newsList.length === 0
        ) {

            newsContainer.innerHTML = `

                <p class="no-news">
                    No news yet.
                </p>

            `;

            return;

        }


        /* =================================================
           카드 생성
        ================================================= */

        newsList.forEach(
            (newsItem) => {

                const data =
                    newsItem.data;

                const newsId =
                    newsItem.id;


                /* -----------------------------------------
                   기본 데이터
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
                   상세페이지 템플릿 결정
                ----------------------------------------- */

                const templatePath =
                    getTemplatePath(
                        data
                    );


                /* -----------------------------------------
                   상세페이지 URL
                ----------------------------------------- */

                const detailURL =
                    `${templatePath}?id=${encodeURIComponent(newsId)}`;


                console.log(
                    "News 카드 연결:",
                    {
                        newsId,
                        template:
                            data.template,
                        templatePath,
                        detailURL
                    }
                );


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
                        href="${escapeHTML(detailURL)}"
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


    }

    catch (error) {

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
   8. DATE VALUE
========================================================= */

function getDateValue(data) {

    /*
       Firebase Timestamp
    */

    if (
        data.createdAt &&
        typeof data.createdAt.toMillis === "function"
    ) {

        return data.createdAt.toMillis();

    }


    /*
       일반 Date 문자열
    */

    if (
        data.date
    ) {

        const parsed =
            new Date(
                data.date
            ).getTime();


        if (
            !isNaN(parsed)
        ) {

            return parsed;

        }

    }


    /*
       createdAt 문자열
    */

    if (
        data.createdAt
    ) {

        const parsed =
            new Date(
                data.createdAt
            ).getTime();


        if (
            !isNaN(parsed)
        ) {

            return parsed;

        }

    }


    /*
       날짜가 없으면
       가장 오래된 것으로 처리
    */

    return 0;

}


/* =========================================================
   9. HTML ESCAPE
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
   10. 실행
========================================================= */

loadNews();
