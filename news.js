/* =========================================================
   NEWS.JS
   ---------------------------------------------------------
   news.html과 같은 폴더에 위치

   역할
   1. Firebase news 컬렉션 불러오기
   2. 최신 News 카드 표시
   3. 최대 표시 개수 유지
   4. 저장된 design 값에 따라 상세페이지 연결
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
   Firebase에 저장된 design/template 값을 확인해서
   해당 상세페이지 HTML을 반환
========================================================= */

function getTemplatePath(data) {

    /*
       Admin에서 새로 저장하는 값:
       
       design:
       "LearningNote"

       "FilmArchiveDesign"

       "VintageFlowerDesign"

       "HomeBakingDesign"

       "MInimalPortfolio"

       "ModernMaturityDesign"
    */

    const rawTemplate =
        data.design ||
        data.template ||
        data.templateName ||
        "";

    
    const template =
        String(
            rawTemplate
        )
        .trim()
        .toLowerCase();


    console.log(
        "디자인 확인:",
        {
            original:
                rawTemplate,
            normalized:
                template
        }
    );


    /* =====================================================
       LEARNING NOTE
    ===================================================== */

    if (

        template === "learningnote" ||

        template === "learning note" ||

        template === "learningnote.html"

    ) {

        return "LearningNote.html";

    }


    /* =====================================================
       FILM ARCHIVE
    ===================================================== */

    if (

        template === "filmarchivedesign" ||

        template === "filmarchivedesign.html" ||

        template === "film archive" ||

        template === "film archive design" ||

        template === "childhood" ||

        template === "childhood.html" ||

        template === "design1" ||

        template === "design01"

    ) {

        return "FilmArchiveDesign.html";

    }


    /* =====================================================
       VINTAGE FLOWER
    ===================================================== */

    if (

        template === "vintageflowerdesign" ||

        template === "vintageflowerdesign.html" ||

        template === "vintage flower" ||

        template === "vintage flower design" ||

        template === "design2" ||

        template === "design02"

    ) {

        return "VintageFlowerDesign.html";

    }


    /* =====================================================
       HOME BAKING
    ===================================================== */

    if (

        template === "homebakingdesign" ||

        template === "homebakingdesign.html" ||

        template === "home baking" ||

        template === "home baking design" ||

        template === "design3" ||

        template === "design03"

    ) {

        return "HomeBakingDesign.html";

    }


    /* =====================================================
       MINIMAL PORTFOLIO
       -----------------------------------------------------
       주의:
       기존 파일명이 MInimalPortfolio.html
       대문자 I를 그대로 유지
    ===================================================== */

    if (

        template === "minimalportfolio" ||

        template === "minimalportfolio.html" ||

        template === "minimal portfolio" ||

        template === "minimal portfolio design" ||

        template === "mininalportfolio" ||

        template === "design4" ||

        template === "design04"

    ) {

        return "MInimalPortfolio.html";

    }


    /* =====================================================
       MODERN MATURITY
    ===================================================== */

    if (

        template === "modernmaturitydesign" ||

        template === "modernmaturitydesign.html" ||

        template === "modern maturity" ||

        template === "modern maturity design" ||

        template === "design5" ||

        template === "design05"

    ) {

        return "ModernMaturityDesign.html";

    }


    /* =====================================================
       DEFAULT
       -----------------------------------------------------
       디자인 정보가 없을 경우
    ===================================================== */

    console.warn(
        "⚠️ 알 수 없는 디자인입니다:",
        rawTemplate
    );


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


                /*
                   이미지 우선순위

                   1. image
                   2. heroImage
                   3. imageUrl
                   4. 기본 이미지
                */

                const image =
                    data.image ||
                    data.heroImage ||
                    data.imageUrl ||
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
                    "===================================="
                );

                console.log(
                    "News 카드 연결"
                );

                console.log(
                    "문서 ID:",
                    newsId
                );

                console.log(
                    "Design:",
                    data.design
                );

                console.log(
                    "Template:",
                    data.template
                );

                console.log(
                    "Template Name:",
                    data.templateName
                );

                console.log(
                    "연결 페이지:",
                    templatePath
                );

                console.log(
                    "상세 URL:",
                    detailURL
                );

                console.log(
                    "===================================="
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
                                    ${escapeHTML(
                                        formatDisplayDate(date)
                                    )}
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

        typeof data.createdAt.toMillis ===
        "function"

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
   9. DISPLAY DATE
========================================================= */

function formatDisplayDate(value) {

    if (
        !value
    ) {

        return "";

    }


    /*
       Firebase Timestamp
    */

    if (

        typeof value.toDate ===
        "function"

    ) {

        const date =
            value.toDate();


        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    /*
       문자열
    */

    const date =
        new Date(
            value
        );


    if (
        !isNaN(
            date.getTime()
        )
    ) {

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    return String(value);

}


/* =========================================================
   10. HTML ESCAPE
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
   11. EXECUTE
========================================================= */

loadNews();
