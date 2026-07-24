```javascript
/* =========================================================
   NEWS.JS
   독립된 Firebase 연결 파일
   news.html과 같은 폴더에 위치
========================================================= */


/* =========================================================
   1. FIREBASE IMPORT
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   2. FIREBASE CONFIG
   ---------------------------------------------------------
   ⚠️ 기존 Firebase 프로젝트의 Config를 그대로 넣어주세요.
========================================================= */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT.appspot.com",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


/* =========================================================
   3. FIREBASE INITIALIZE
========================================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   4. NEWS COLLECTION 불러오기
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
           news 컬렉션 전체 조회
        --------------------------------------------- */

        const newsRef =
            collection(
                db,
                "news"
            );


        const snapshot =
            await getDocs(
                newsRef
            );


        console.log(
            "Firebase 문서 개수:",
            snapshot.size
        );


        /* ---------------------------------------------
           각 문서 확인
        --------------------------------------------- */

        snapshot.forEach(
            (docSnapshot) => {

                console.log(
                    "------------------------------------"
                );

                console.log(
                    "문서 ID:",
                    docSnapshot.id
                );

                console.log(
                    "문서 데이터:",
                    docSnapshot.data()
                );

                console.log(
                    "------------------------------------"
                );

            }
        );


    } catch (error) {

        console.error(
            "Firebase News Load Error:",
            error
        );

    }

}


/* =========================================================
   5. 실행
========================================================= */

loadNews();
```

