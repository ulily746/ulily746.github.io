/* =========================================================
   GLOBAL STATE
========================================================= */

let allNews = [];

let currentFilter = 'ALL';


/* =========================================================
   DESIGN FIELD IDS
   모든 디자인 입력 영역을 한 곳에서 관리
========================================================= */

const DESIGN_FIELD_IDS = [

    'filmArchiveFields',

    'vintageFlowerFields',

    'homeBakingFields',

    'minimalPortfolioFields',

    'modernMaturityFields'

];


/* =========================================================
   DESIGN FIELD ELEMENT HELPER
========================================================= */

function getDesignField(id){

    return document.getElementById(id);

}


/* =========================================================
   HIDE ALL DESIGN FORMS
========================================================= */

function hideAllDesignFields(){

    DESIGN_FIELD_IDS.forEach(

        id => {

            const element =
                getDesignField(id);


            if(element){

                element.style.display =
                    'none';

            }

        }

    );

}


/* =========================================================
   SHOW SELECTED DESIGN FORM
========================================================= */

function handleDesignChange(){

    const design =
        document
        .getElementById('entryDesign')
        .value;


    hideAllDesignFields();


    const designMap = {

        FilmArchiveDesign:
            'filmArchiveFields',

        VintageFlowerDesign:
            'vintageFlowerFields',

        HomeBakingDesign:
            'homeBakingFields',

        MinimalPortfolioDesign:
            'minimalPortfolioFields',

        ModernMaturityDesign:
            'modernMaturityFields'

    };


    const targetId =
        designMap[design];


    if(!targetId){

        console.warn(
            'Unknown design:',
            design
        );

        return;

    }


    const target =
        document
        .getElementById(targetId);


    if(!target){

        console.error(
            'Design form not found:',
            targetId
        );

        return;

    }


    target.style.display =
        'block';

}


/* =========================================================
   SELECT DESIGN CARD
   핵심 수정:
   디자인을 먼저 지정한 후 모달을 연다.
========================================================= */

function selectDesign(design){

    resetForm();


    document
    .getElementById('entryDesign')
    .value =
    design;


    document
    .getElementById('modalTitle')
    .textContent =
    'New Archive Entry';


    document
    .getElementById('saveButton')
    .textContent =
    'Save Entry';


    document
    .getElementById('editingEntryId')
    .value =
    '';


    handleDesignChange();


    openModal();

}


/* =========================================================
   OPEN NEW MODAL
========================================================= */

function openNewModal(){

    resetForm();


    document
    .getElementById('modalTitle')
    .textContent =
    'New Archive Entry';


    document
    .getElementById('saveButton')
    .textContent =
    'Save Entry';


    document
    .getElementById('editingEntryId')
    .value =
    '';


    /*
        일반적으로 NEW ENTRY 버튼을 누르면
        Film Archive를 기본 디자인으로 표시
    */

    document
    .getElementById('entryDesign')
    .value =
    'FilmArchiveDesign';


    handleDesignChange();


    openModal();

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal(){

    const modal =
        document
        .getElementById('entryModal');


    if(!modal){

        console.error(
            '#entryModal not found.'
        );

        return;

    }


    modal
    .classList
    .add('active');

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(){

    const modal =
        document
        .getElementById('entryModal');


    if(!modal){

        return;

    }


    modal
    .classList
    .remove('active');

}


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

const entryModal =
    document
    .getElementById('entryModal');


if(entryModal){

    entryModal.addEventListener(

        'click',

        function(event){

            if(
                event.target ===
                entryModal
            ){

                closeModal();

            }

        }

    );

}


/* =========================================================
   EDIT ENTRY
========================================================= */

async function editEntry(id){

    const entry =
        allNews.find(

            item =>
            item.id === id

        );


    if(!entry){

        alert(
            'Entry not found.'
        );

        return;

    }


    /*
        먼저 모든 폼 초기화
    */

    resetForm();


    /*
        기본 정보
    */

    document
    .getElementById('editingEntryId')
    .value =
    id;


    document
    .getElementById('entryTitle')
    .value =
    entry.title || '';


    document
    .getElementById('entryCategory')
    .value =
    entry.category || 'Research';


    document
    .getElementById('entryDesign')
    .value =
    entry.design || 'FilmArchiveDesign';


    document
    .getElementById('entryDescription')
    .value =
    entry.description || '';


    document
    .getElementById('entryDate')
    .value =
    entry.date || '';


    document
    .getElementById('entryStatus')
    .value =
    entry.status || 'Draft';


    document
    .getElementById('entryImage')
    .value =
    entry.image || '';


    /*
        디자인 폼 표시
    */

    handleDesignChange();


    /*
        디자인별 데이터 복원
    */

    switch(entry.design){

        case 'FilmArchiveDesign':

            fillFilmArchiveForm(
                entry.content || {}
            );

            break;


        case 'VintageFlowerDesign':

            fillVintageFlowerForm(
                entry
            );

            break;


        case 'HomeBakingDesign':

            fillHomeBakingForm(
                entry
            );

            break;


        case 'MinimalPortfolioDesign':

            fillMinimalPortfolioForm(
                entry
            );

            break;


        case 'ModernMaturityDesign':

            fillModernMaturityForm(
                entry
            );

            break;


        default:

            console.warn(
                'Unknown design:',
                entry.design
            );

    }


    /*
        모달 제목
    */

    document
    .getElementById('modalTitle')
    .textContent =
    'Edit Archive Entry';


    document
    .getElementById('saveButton')
    .textContent =
    'Update Entry';


    openModal();

}


/* =========================================================
   FILL FILM ARCHIVE FORM
========================================================= */

function fillFilmArchiveForm(content){

    const hero =
        content.hero || {};

    const intro =
        content.intro || {};

    const memories =
        content.memories || [];

    const video =
        content.video || {};

    const films =
        content.films || [];

    const travel =
        content.travel || {};


    document
    .getElementById('heroTitleTop')
    .value =
    hero.titleTop || '';


    document
    .getElementById('heroTitleBottom1')
    .value =
    hero.titleBottom1 || '';


    document
    .getElementById('heroTitleBottom2')
    .value =
    hero.titleBottom2 || '';


    document
    .getElementById('heroImage')
    .value =
    hero.image || '';


    document
    .getElementById('introText')
    .value =
    intro.text || '';


    for(let i = 1; i <= 4; i++){

        const memory =
            memories[i - 1] || {};


        document
        .getElementById(
            `memory${i}Image`
        )
        .value =
        memory.image || '';


        document
        .getElementById(
            `memory${i}Text`
        )
        .value =
        memory.text || '';

    }


    document
    .getElementById('videoUrl')
    .value =
    video.url || '';


    document
    .getElementById('videoCaption')
    .value =
    video.caption || '';


    for(let i = 1; i <= 3; i++){

        const film =
            films[i - 1] || {};


        document
        .getElementById(
            `film${i}Image`
        )
        .value =
        film.image || '';


        document
        .getElementById(
            `film${i}Title`
        )
        .value =
        film.title || '';


        document
        .getElementById(
            `film${i}Text`
        )
        .value =
        film.text || '';

    }


    document
    .getElementById('travelMonth')
    .value =
    travel.month || '';


    document
    .getElementById('travelYear')
    .value =
    travel.year || '';


    document
    .getElementById('travelLocation')
    .value =
    travel.location || '';


    document
    .getElementById('travelText')
    .value =
    travel.text || '';

}


/* =========================================================
   FILL VINTAGE FLOWER FORM
========================================================= */

function fillVintageFlowerForm(entry){

    document
    .getElementById('vintageHeroImage')
    .value =
    entry.heroImage || '';


    document
    .getElementById('vintageHeroTitle')
    .value =
    entry.heroTitle || '';


    document
    .getElementById('vintageHeroSubtitle')
    .value =
    entry.heroEyebrow || '';


    document
    .getElementById('vintageIntroTitle')
    .value =
    entry.chapter01Title || '';


    document
    .getElementById('vintageIntroText')
    .value =
    entry.chapter01Description || '';


    document
    .getElementById('vintageFlower1Image')
    .value =
    entry.page01Image ||
    entry.chapter01Image ||
    '';


    document
    .getElementById('vintageFlower1Title')
    .value =
    entry.page01Title || '';


    document
    .getElementById('vintageFlower1Text')
    .value =
    entry.page01Description || '';


    document
    .getElementById('vintageFlower2Image')
    .value =
    entry.page02Image ||
    entry.chapter02Image ||
    '';


    document
    .getElementById('vintageFlower2Title')
    .value =
    entry.page02Title ||
    entry.chapter02Title ||
    '';


    document
    .getElementById('vintageFlower2Text')
    .value =
    entry.page02Description ||
    entry.chapter02Description ||
    '';


    document
    .getElementById('vintageFlower3Image')
    .value =
    entry.page03Image || '';


    document
    .getElementById('vintageFlower3Title')
    .value =
    entry.page03Title || '';


    document
    .getElementById('vintageFlower3Text')
    .value =
    entry.page03Description || '';


    document
    .getElementById('vintageJournalTitle')
    .value =
    entry.videoTitle || '';


    document
    .getElementById('vintageJournalText')
    .value =
    entry.videoDescription || '';


    document
    .getElementById('vintageGallery1Image')
    .value =
    entry.memoryAImage ||
    entry.ribbonImage ||
    '';


    document
    .getElementById('vintageGallery2Image')
    .value =
    entry.memoryBImage || '';


    document
    .getElementById('vintageGallery3Image')
    .value =
    entry.memoryCImage || '';


    document
    .getElementById('vintageGallery4Image')
    .value =
    entry.memoryDImage || '';

}


/* =========================================================
   FILL HOME BAKING FORM
   반드시 home 접두사 ID 사용
========================================================= */

function fillHomeBakingForm(entry){

    const fields = {

        homeHeroImage:
            entry.homeHeroImage,

        homeHeroTitle:
            entry.homeHeroTitle,

        homeHeroDescription:
            entry.homeHeroDescription,

        homeSectionTitle:
            entry.homeSectionTitle,

        homeSectionDescription:
            entry.homeSectionDescription,

        homePolaroid01Image:
            entry.homePolaroid01Image,

        homePolaroid01Title:
            entry.homePolaroid01Title,

        homePolaroid01Description:
            entry.homePolaroid01Description,

        homePolaroid02Image:
            entry.homePolaroid02Image,

        homePolaroid02Title:
            entry.homePolaroid02Title,

        homePolaroid02Description:
            entry.homePolaroid02Description,

        homePolaroid03Image:
            entry.homePolaroid03Image,

        homePolaroid03Title:
            entry.homePolaroid03Title,

        homePolaroid03Description:
            entry.homePolaroid03Description,

        homeGallery01Image:
            entry.homeGallery01Image,

        homeGallery02Image:
            entry.homeGallery02Image,

        homeGallery03Image:
            entry.homeGallery03Image,

        homeAboutImage:
            entry.homeAboutImage,

        homeAboutEyebrow:
            entry.homeAboutEyebrow,

        homeAboutTitle:
            entry.homeAboutTitle,

        homeAboutDescription:
            entry.homeAboutDescription

    };


    Object
    .entries(fields)
    .forEach(

        ([id, value]) => {

            const element =
                document
                .getElementById(id);


            if(element){

                element.value =
                    value || '';

            }

        }

    );

}


/* =========================================================
   FILL MINIMAL PORTFOLIO FORM
========================================================= */

function fillMinimalPortfolioForm(entry){

    const fields = {

        minimalHeroImage:
            entry.minimalHeroImage,

        minimalHeroEyebrow:
            entry.minimalHeroEyebrow,

        minimalHeroTitle:
            entry.minimalHeroTitle,

        minimalHeroDescription:
            entry.minimalHeroDescription,


        minimalPlace01Image:
            entry.minimalPlace01Image,

        minimalPlace01Label:
            entry.minimalPlace01Label,

        minimalPlace01Title:
            entry.minimalPlace01Title,

        minimalPlace01Description:
            entry.minimalPlace01Description,


        minimalStatementEyebrow:
            entry.minimalStatementEyebrow,

        minimalStatementTitle:
            entry.minimalStatementTitle,

        minimalStatementDescription:
            entry.minimalStatementDescription,


        minimalPlace02Image:
            entry.minimalPlace02Image,

        minimalPlace02Label:
            entry.minimalPlace02Label,

        minimalPlace02Title:
            entry.minimalPlace02Title,

        minimalPlace02Description:
            entry.minimalPlace02Description,


        minimalGalleryEyebrow:
            entry.minimalGalleryEyebrow,

        minimalGalleryTitle:
            entry.minimalGalleryTitle,

        minimalGalleryDescription:
            entry.minimalGalleryDescription,


        minimalGallery01Image:
            entry.minimalGallery01Image,

        minimalGallery02Image:
            entry.minimalGallery02Image,

        minimalGallery03Image:
            entry.minimalGallery03Image,

        minimalGallery04Image:
            entry.minimalGallery04Image,

        minimalGallery05Image:
            entry.minimalGallery05Image,

        minimalGallery06Image:
            entry.minimalGallery06Image,


        minimalMovingEyebrow:
            entry.minimalMovingEyebrow,

        minimalMovingTitle:
            entry.minimalMovingTitle,

        minimalMovingDescription:
            entry.minimalMovingDescription,

        minimalMovingVideo:
            entry.minimalMovingVideo,

        minimalMovingCaption:
            entry.minimalMovingCaption,


        minimalFinalEyebrow:
            entry.minimalFinalEyebrow,

        minimalFinalTitle:
            entry.minimalFinalTitle,

        minimalFinalDescription:
            entry.minimalFinalDescription,


        minimalEndingImage:
            entry.minimalEndingImage,

        minimalEndingEyebrow:
            entry.minimalEndingEyebrow,

        minimalEndingDescription:
            entry.minimalEndingDescription

    };


    Object
    .entries(fields)
    .forEach(

        ([id, value]) => {

            const element =
                document
                .getElementById(id);


            if(element){

                element.value =
                    value || '';

            }

        }

    );

}


/* =========================================================
   FILL MODERN MATURITY FORM
========================================================= */

function fillModernMaturityForm(entry){

    const fields = {

        modernHeroEyebrow:
            entry.modernHeroEyebrow,

        modernHeroTitle:
            entry.modernHeroTitle,

        modernHeroImage:
            entry.modernHeroImage,

        modernHeroQuote:
            entry.modernHeroQuote,

        modernHeroDescription:
            entry.modernHeroDescription,


        modernSection01Image:
            entry.modernSection01Image,

        modernSection01SubImage:
            entry.modernSection01SubImage,

        modernSection01Title:
            entry.modernSection01Title,

        modernSection01Description:
            entry.modernSection01Description,


        modernSection02Image01:
            entry.modernSection02Image01,

        modernSection02Image02:
            entry.modernSection02Image02,

        modernSection02Title:
            entry.modernSection02Title,

        modernSection02Description:
            entry.modernSection02Description,


        modernSection03Image:
            entry.modernSection03Image,

        modernSection03Title:
            entry.modernSection03Title,

        modernSection03Description:
            entry.modernSection03Description,


        modernSection04Image:
            entry.modernSection04Image,

        modernSection04SubImage:
            entry.modernSection04SubImage,

        modernSection04Title:
            entry.modernSection04Title,

        modernSection04Description:
            entry.modernSection04Description

    };


    Object
    .entries(fields)
    .forEach(

        ([id, value]) => {

            const element =
                document
                .getElementById(id);


            if(element){

                element.value =
                    value || '';

            }

        }

    );

}


/* =========================================================
   COLLECT DESIGN CONTENT
========================================================= */

function collectDesignContent(){

    const design =
        document
        .getElementById('entryDesign')
        .value;


    let designContent = {};


    /* =====================================================
       FILM ARCHIVE
    ===================================================== */

    if(
        design ===
        'FilmArchiveDesign'
    ){

        designContent = {

            hero: {

                titleTop:
                    document
                    .getElementById('heroTitleTop')
                    .value
                    .trim(),

                titleBottom1:
                    document
                    .getElementById('heroTitleBottom1')
                    .value
                    .trim(),

                titleBottom2:
                    document
                    .getElementById('heroTitleBottom2')
                    .value
                    .trim(),

                image:
                    document
                    .getElementById('heroImage')
                    .value
                    .trim()

            },


            intro: {

                text:
                    document
                    .getElementById('introText')
                    .value
                    .trim()

            },


            memories: [

                1,2,3,4

            ].map(

                i => ({

                    image:
                        document
                        .getElementById(
                            `memory${i}Image`
                        )
                        .value
                        .trim(),

                    text:
                        document
                        .getElementById(
                            `memory${i}Text`
                        )
                        .value
                        .trim()

                })

            ),


            video: {

                url:
                    document
                    .getElementById('videoUrl')
                    .value
                    .trim(),

                caption:
                    document
                    .getElementById('videoCaption')
                    .value
                    .trim()

            },


            films: [

                1,2,3

            ].map(

                i => ({

                    image:
                        document
                        .getElementById(
                            `film${i}Image`
                        )
                        .value
                        .trim(),

                    title:
                        document
                        .getElementById(
                            `film${i}Title`
                        )
                        .value
                        .trim(),

                    text:
                        document
                        .getElementById(
                            `film${i}Text`
                        )
                        .value
                        .trim()

                })

            ),


            travel: {

                month:
                    document
                    .getElementById('travelMonth')
                    .value
                    .trim(),

                year:
                    document
                    .getElementById('travelYear')
                    .value
                    .trim(),

                location:
                    document
                    .getElementById('travelLocation')
                    .value
                    .trim(),

                text:
                    document
                    .getElementById('travelText')
                    .value
                    .trim()

            }

        };

    }


    /* =====================================================
       VINTAGE FLOWER
    ===================================================== */

    else if(
        design ===
        'VintageFlowerDesign'
    ){

        designContent = {

            heroEyebrow:
                document
                .getElementById('vintageHeroSubtitle')
                .value
                .trim(),

            heroTitle:
                document
                .getElementById('vintageHeroTitle')
                .value
                .trim(),

            heroImage:
                document
                .getElementById('vintageHeroImage')
                .value
                .trim(),


            chapter01Title:
                document
                .getElementById('vintageIntroTitle')
                .value
                .trim(),

            chapter01Description:
                document
                .getElementById('vintageIntroText')
                .value
                .trim(),


            page01Label:
                'PAGE .01',

            page01Title:
                document
                .getElementById('vintageFlower1Title')
                .value
                .trim(),

            page01Description:
                document
                .getElementById('vintageFlower1Text')
                .value
                .trim(),

            page01Image:
                document
                .getElementById('vintageFlower1Image')
                .value
                .trim(),


            page02Label:
                'PAGE .02',

            page02Title:
                document
                .getElementById('vintageFlower2Title')
                .value
                .trim(),

            page02Description:
                document
                .getElementById('vintageFlower2Text')
                .value
                .trim(),

            page02Image:
                document
                .getElementById('vintageFlower2Image')
                .value
                .trim(),


            page03Label:
                'PAGE .03',

            page03Title:
                document
                .getElementById('vintageFlower3Title')
                .value
                .trim(),

            page03Description:
                document
                .getElementById('vintageFlower3Text')
                .value
                .trim(),

            page03Image:
                document
                .getElementById('vintageFlower3Image')
                .value
                .trim(),


            videoTitle:
                document
                .getElementById('vintageJournalTitle')
                .value
                .trim(),

            videoDescription:
                document
                .getElementById('vintageJournalText')
                .value
                .trim(),


            memoryAImage:
                document
                .getElementById('vintageGallery1Image')
                .value
                .trim(),

            memoryBImage:
                document
                .getElementById('vintageGallery2Image')
                .value
                .trim(),

            memoryCImage:
                document
                .getElementById('vintageGallery3Image')
                .value
                .trim(),

            memoryDImage:
                document
                .getElementById('vintageGallery4Image')
                .value
                .trim()

        };

    }


    /* =====================================================
       HOME BAKING
    ===================================================== */

    else if(
        design ===
        'HomeBakingDesign'
    ){

        designContent = {

            homeHeroImage:
                document
                .getElementById('homeHeroImage')
                .value
                .trim(),

            homeHeroTitle:
                document
                .getElementById('homeHeroTitle')
                .value
                .trim(),

            homeHeroDescription:
                document
                .getElementById('homeHeroDescription')
                .value
                .trim(),


            homeSectionTitle:
                document
                .getElementById('homeSectionTitle')
                .value
                .trim(),

            homeSectionDescription:
                document
                .getElementById('homeSectionDescription')
                .value
                .trim(),


            homePolaroid01Image:
                document
                .getElementById('homePolaroid01Image')
                .value
                .trim(),

            homePolaroid01Title:
                document
                .getElementById('homePolaroid01Title')
                .value
                .trim(),

            homePolaroid01Description:
                document
                .getElementById('homePolaroid01Description')
                .value
                .trim(),


            homePolaroid02Image:
                document
                .getElementById('homePolaroid02Image')
                .value
                .trim(),

            homePolaroid02Title:
                document
                .getElementById('homePolaroid02Title')
                .value
                .trim(),

            homePolaroid02Description:
                document
                .getElementById('homePolaroid02Description')
                .value
                .trim(),


            homePolaroid03Image:
                document
                .getElementById('homePolaroid03Image')
                .value
                .trim(),

            homePolaroid03Title:
                document
                .getElementById('homePolaroid03Title')
                .value
                .trim(),

            homePolaroid03Description:
                document
                .getElementById('homePolaroid03Description')
                .value
                .trim(),


            homeGallery01Image:
                document
                .getElementById('homeGallery01Image')
                .value
                .trim(),

            homeGallery02Image:
                document
                .getElementById('homeGallery02Image')
                .value
                .trim(),

            homeGallery03Image:
                document
                .getElementById('homeGallery03Image')
                .value
                .trim(),


            homeAboutImage:
                document
                .getElementById('homeAboutImage')
                .value
                .trim(),

            homeAboutEyebrow:
                document
                .getElementById('homeAboutEyebrow')
                .value
                .trim(),

            homeAboutTitle:
                document
                .getElementById('homeAboutTitle')
                .value
                .trim(),

            homeAboutDescription:
                document
                .getElementById('homeAboutDescription')
                .value
                .trim()

        };

    }


    /* =====================================================
       MINIMAL PORTFOLIO
    ===================================================== */

    else if(
        design ===
        'MinimalPortfolioDesign'
    ){

        const ids = [

            'minimalHeroImage',
            'minimalHeroEyebrow',
            'minimalHeroTitle',
            'minimalHeroDescription',

            'minimalPlace01Image',
            'minimalPlace01Label',
            'minimalPlace01Title',
            'minimalPlace01Description',

            'minimalStatementEyebrow',
            'minimalStatementTitle',
            'minimalStatementDescription',

            'minimalPlace02Image',
            'minimalPlace02Label',
            'minimalPlace02Title',
            'minimalPlace02Description',

            'minimalGalleryEyebrow',
            'minimalGalleryTitle',
            'minimalGalleryDescription',

            'minimalGallery01Image',
            'minimalGallery02Image',
            'minimalGallery03Image',
            'minimalGallery04Image',
            'minimalGallery05Image',
            'minimalGallery06Image',

            'minimalMovingEyebrow',
            'minimalMovingTitle',
            'minimalMovingDescription',
            'minimalMovingVideo',
            'minimalMovingCaption',

            'minimalFinalEyebrow',
            'minimalFinalTitle',
            'minimalFinalDescription',

            'minimalEndingImage',
            'minimalEndingEyebrow',
            'minimalEndingDescription'

        ];


        ids.forEach(

            id => {

                designContent[id] =

                    document
                    .getElementById(id)
                    .value
                    .trim();

            }

        );

    }


    /* =====================================================
       MODERN MATURITY
    ===================================================== */

    else if(
        design ===
        'ModernMaturityDesign'
    ){

        const ids = [

            'modernHeroEyebrow',
            'modernHeroTitle',
            'modernHeroImage',
            'modernHeroQuote',
            'modernHeroDescription',

            'modernSection01Image',
            'modernSection01SubImage',
            'modernSection01Title',
            'modernSection01Description',

            'modernSection02Image01',
            'modernSection02Image02',
            'modernSection02Title',
            'modernSection02Description',

            'modernSection03Image',
            'modernSection03Title',
            'modernSection03Description',

            'modernSection04Image',
            'modernSection04SubImage',
            'modernSection04Title',
            'modernSection04Description'

        ];


        ids.forEach(

            id => {

                designContent[id] =

                    document
                    .getElementById(id)
                    .value
                    .trim();

            }

        );

    }


    return designContent;

}


/* =========================================================
   SAVE / UPDATE ENTRY
========================================================= */

async function saveEntry(){

    const title =
        document
        .getElementById('entryTitle')
        .value
        .trim();


    const category =
        document
        .getElementById('entryCategory')
        .value;


    const design =
        document
        .getElementById('entryDesign')
        .value;


    const description =
        document
        .getElementById('entryDescription')
        .value
        .trim();


    const date =
        document
        .getElementById('entryDate')
        .value;


    const status =
        document
        .getElementById('entryStatus')
        .value;


    const image =
        document
        .getElementById('entryImage')
        .value
        .trim();


    const editingId =
        document
        .getElementById('editingEntryId')
        .value;


    if(!title){

        alert(
            'Please enter a title.'
        );

        return;

    }


    if(!window.firebaseDB){

        alert(
            'Firebase is not connected.'
        );

        return;

    }


    const designContent =
        collectDesignContent();


    const entryData = {

        title,

        category,

        design,

        description,

        date,

        status,

        image

    };


    /*
        Film Archive만 content 내부 저장

        나머지 4개 디자인은
        Firebase TOP-LEVEL 저장
    */

    if(
        design ===
        'FilmArchiveDesign'
    ){

        entryData.content =
            designContent;

    }

    else{

        Object.assign(

            entryData,

            designContent

        );

    }


    try{

        /*
            EDIT
        */

        if(editingId){

            const entryRef =
                window.firebaseDoc(

                    window.firebaseDB,

                    'news',

                    editingId

                );


            await window.firebaseUpdateDoc(

                entryRef,

                {

                    ...entryData,

                    updatedAt:
                        window.firebaseServerTimestamp()

                }

            );


            alert(
                'Entry updated successfully!'
            );

        }


        /*
            NEW
        */

        else{

            await window.firebaseAddDoc(

                window.firebaseCollection(

                    window.firebaseDB,

                    'news'

                ),

                {

                    ...entryData,

                    createdAt:
                        window.firebaseServerTimestamp()

                }

            );


            alert(
                'Entry saved successfully!'
            );

        }


        closeModal();


        resetForm();


        await loadNews();

    }


    catch(error){

        console.error(
            'Firebase save error:',
            error
        );


        alert(
            'Failed to save entry. Please check the browser console.'
        );

    }

}


/* =========================================================
   DELETE ENTRY
========================================================= */

async function deleteEntry(id){

    const entry =
        allNews.find(

            item =>
            item.id === id

        );


    if(!entry){

        alert(
            'Entry not found.'
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${entry.title}"?`
        );


    if(!confirmed){

        return;

    }


    try{

        const entryRef =
            window.firebaseDoc(

                window.firebaseDB,

                'news',

                id

            );


        await window.firebaseDeleteDoc(

            entryRef

        );


        alert(
            'Entry deleted successfully!'
        );


        await loadNews();

    }


    catch(error){

        console.error(
            'Delete error:',
            error
        );


        alert(
            'Failed to delete entry.'
        );

    }

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm(){

    /*
        기본 필드
    */

    const basicFields = [

        'editingEntryId',

        'entryTitle',

        'entryDescription',

        'entryDate',

        'entryImage'

    ];


    basicFields.forEach(

        id => {

            const element =
                document
                .getElementById(id);


            if(element){

                element.value =
                    '';

            }

        }

    );


    document
    .getElementById('entryCategory')
    .value =
    'Research';


    document
    .getElementById('entryDesign')
    .value =
    'FilmArchiveDesign';


    document
    .getElementById('entryStatus')
    .value =
    'Published';


    /*
        모든 디자인 폼의 input / textarea 초기화
    */

    DESIGN_FIELD_IDS.forEach(

        fieldId => {

            const container =
                document
                .getElementById(fieldId);


            if(!container){

                return;

            }


            container
            .querySelectorAll(
                'input, textarea, select'
            )
            .forEach(

                element => {

                    element.value =
                        '';

                }

            );

        }

    );


    /*
        모든 디자인 폼 숨기기
    */

    hideAllDesignFields();

}


/* =========================================================
   FIREBASE LOAD NEWS
========================================================= */

async function loadNews(){

    if(!window.firebaseDB){

        console.log(
            'Firebase not ready. Retrying...'
        );


        setTimeout(

            loadNews,

            500

        );


        return;

    }


    const newsList =
        document
        .getElementById('newsList');


    if(!newsList){

        return;

    }


    newsList.innerHTML = `

        <div class="loading-state">

            LOADING ARCHIVE...

        </div>

    `;


    try{

        const snapshot =
            await window.firebaseGetDocs(

                window.firebaseCollection(

                    window.firebaseDB,

                    'news'

                )

            );


        allNews = [];


        snapshot.forEach(

            documentSnapshot => {

                allNews.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }

        );


        allNews.sort(

            (a,b) => {

                const dateA =
                    a.date || '';

                const dateB =
                    b.date || '';


                return dateB
                    .localeCompare(
                        dateA
                    );

            }

        );


        updateStats();


        renderNews();


        console.log(
            'News loaded:',
            allNews
        );

    }


    catch(error){

        console.error(
            'Failed to load news:',
            error
        );


        newsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-title">

                    Unable to load archive

                </div>

                <div class="empty-state-text">

                    Please check Firebase configuration and Firestore rules.

                </div>

            </div>

        `;

    }

}


/* =========================================================
   INITIAL DESIGN STATE
========================================================= */

document.addEventListener(

    'DOMContentLoaded',

    function(){

        hideAllDesignFields();

        handleDesignChange();

    }

);


/* =========================================================
   FIREBASE READY CHECK
========================================================= */

if(window.firebaseDB){

    loadNews();

}




