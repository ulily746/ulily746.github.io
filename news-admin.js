import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyD_d4etBdBcvBRhTJlD3cLssN309LAdlfg",
    authDomain: "yuri-research-portfolio.firebaseapp.com",
    projectId: "yuri-research-portfolio",
    storageBucket: "yuri-research-portfolio.firebasestorage.app",
    messagingSenderId: "231317507996",
    appId: "1:231317507996:web:9773282c138706d886c259",
    measurementId: "G-57VHW2454"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================================
   STATE
========================================================= */

let allEntries = [];
let currentFilter = "ALL";
let selectedDesign = "LearningNote";
let isEditing = false;


/* =========================================================
   DESIGN SETTINGS
========================================================= */

const VALID_DESIGNS = [
    "LearningNote",
    "FilmArchiveDesign",
    "VintageFlowerDesign",
    "HomeBakingDesign",
    "MInimalPortfolio",
    "ModernMaturityDesign"
];

const DESIGN_NAMES = {
    LearningNote: "Learning Note",
    FilmArchiveDesign: "Film Archive",
    VintageFlowerDesign: "Vintage Flower",
    HomeBakingDesign: "Home Baking",
    MInimalPortfolio: "Minimal Portfolio",
    ModernMaturityDesign: "Modern Maturity"
};


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupLearningNoteFields();
    setupFilters();
    setupDesignSelector();
    setupModalEvents();
    setupNewEntryButton();
    setupSaveButton();
    loadNewsEntries();
});


/* =========================================================
   LEARNING NOTE FIELDS (에디터 생성 부분)
========================================================= */

function createContentField() {
    const subcategoryWrapper = document.getElementById("entrySubcategoryWrapper");
    const descriptionField = document.getElementById("entryDescription");

    const insertAfter = subcategoryWrapper || (
        descriptionField ? (descriptionField.closest(".form-group") || descriptionField.parentElement) : null
    );

    if (!insertAfter) return;

    const wrapper = document.createElement("div");
    wrapper.className = "form-group learning-common-field";
    wrapper.id = "entryContentWrapper";

    wrapper.innerHTML = `
        <label class="form-label">
            CONTENT
        </label>

        <!-- contenteditable 에디터 영역 -->
        <div
            id="entryContent"
            class="editor-area"
            contenteditable="true"
            placeholder="내용을 입력하세요. 이미지를 복사(Ctrl+C) 후 여기에 붙여넣기(Ctrl+V)할 수 있습니다."
            style="min-height: 320px; max-height: 500px; overflow-y: auto; border: 1px solid #D8D3CA; background: #FFFDF8; padding: 16px; font-size: 13px; line-height: 1.75; outline: none; border-radius: 2px;"
        ></div>

        <div class="learning-content-help">
            이미지를 직접 복사-붙여넣기(Ctrl+V)할 수 있습니다.
        </div>
    `;

    insertAfter.insertAdjacentElement("afterend", wrapper);

    // 이미지 Paste(붙여넣기) 이벤트 바인딩
    attachImagePasteEvent();
}

/* 이미지 클립보드 Paste 처리 함수 추가 */
function attachImagePasteEvent() {
    setTimeout(() => {
        const editor = document.getElementById("entryContent");
        if (!editor || editor.dataset.pasteBound) return;

        editor.dataset.pasteBound = "true";

        editor.addEventListener("paste", (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;

            for (const item of items) {
                if (item.type.indexOf("image") !== -1) {
                    e.preventDefault(); // 기본 붙여넣기 방지

                    const file = item.getAsFile();
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        const img = document.createElement("img");
                        img.src = event.target.result;

                        // 커서 위치에 이미지 삽입
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(img);

                            range.setStartAfter(img);
                            range.setEndAfter(img);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        } else {
                            editor.appendChild(img);
                        }
                    };

                    reader.readAsDataURL(file);
                }
            }
        });
    }, 100);
}

/* =========================================================
   LOAD ENTRIES
========================================================= */

async function loadNewsEntries() {
    const list = document.getElementById("newsList");

    if (list) {
        list.innerHTML = `
            <div class="loading-state">
                LOADING ARCHIVE...
            </div>
        `;
    }

    try {
        const newsRef = collection(db, "news");

        let snapshot;

        try {
            snapshot = await getDocs(
                query(
                    newsRef,
                    orderBy("date", "desc")
                )
            );
        } catch (error) {
            console.warn(
                "Could not order by date. Loading unsorted.",
                error
            );

            snapshot = await getDocs(newsRef);
        }

        allEntries = [];

        snapshot.forEach(documentSnapshot => {
            if (documentSnapshot.id === "design") {
                return;
            }

            allEntries.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            });
        });

        allEntries.sort(sortEntriesByDate);

        updateStatistics();
        renderNewsList();

    } catch (error) {
        console.error("Failed to load news:", error);

        if (list) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">
                        Unable to Load Archive
                    </div>

                    <div class="empty-state-text">
                        ${escapeHTML(error.message)}
                    </div>
                </div>
            `;
        }
    }
}


/* =========================================================
   RENDER LIST
========================================================= */

function renderNewsList() {
    const list = document.getElementById("newsList");

    if (!list) {
        return;
    }

    const filteredEntries = filterEntries(allEntries);

    if (filteredEntries.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">
                    No Archive Entries
                </div>

                <div class="empty-state-text">
                    No entries match the current filter.
                </div>
            </div>
        `;

        return;
    }

    list.innerHTML = filteredEntries
        .map(createNewsRow)
        .join("");

    attachRowEvents();
}

function createNewsRow(entry) {
    const id = entry.id || "";

    const title =
        entry.title ||
        entry.name ||
        "Untitled Entry";

    const category =
        normalizeCategory(entry.category);

    const design =
        entry.design ||
        entry.designId ||
        "Unknown";

    const status =
        normalizeStatus(entry.status);

    const description =
        entry.description ||
        entry.shortDescription ||
        "";

    const image =
        entry.image ||
        entry.imageUrl ||
        getContentValue(entry, "vintageHeroImage") ||
        getContentValue(entry, "minimalHeroImage") ||
        getContentValue(entry, "filmHeroImage") ||
        getContentValue(entry, "bakingHeroImage") ||
        getContentValue(entry, "modernHeroImage") ||
        "";

    const date = formatDate(entry.date);

    const statusClass =
        status === "Published"
            ? "status-published"
            : "status-draft";

    return `
        <div
            class="news-row"
            data-entry-id="${escapeHTML(id)}"
        >
            <div>
                ${
                    image
                        ? `
                            <img
                                class="thumb"
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                onerror="this.style.display='none';"
                            >
                        `
                        : `
                            <div class="thumb"></div>
                        `
                }
            </div>

            <div>
                <div class="news-title">
                    ${escapeHTML(title)}
                </div>

                <div class="news-meta">
                    ${
                        date
                            ? escapeHTML(date)
                            : ""
                    }

                    ${
                        description
                            ? " · " +
                              escapeHTML(
                                  truncateText(
                                      description,
                                      70
                                  )
                              )
                            : ""
                    }
                </div>
            </div>

            <div>
                <span class="tag">
                    ${escapeHTML(category)}
                </span>
            </div>

            <div>
                <span class="design-tag">
                    ${escapeHTML(
                        getDesignDisplayName(design)
                    )}
                </span>
            </div>

            <div>
                <span class="${statusClass}">
                    ● ${escapeHTML(status)}
                </span>
            </div>

            <div>
                <div class="actions">
                    <span
                        class="action edit-action"
                        data-id="${escapeHTML(id)}"
                    >
                        EDIT
                    </span>

                    <span
                        class="action delete delete-action"
                        data-id="${escapeHTML(id)}"
                    >
                        DELETE
                    </span>
                </div>
            </div>
        </div>
    `;
}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {
    document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            document
                .querySelectorAll(".filter")
                .forEach(item => {
                    item.classList.remove("active");
                });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter || "ALL";

            renderNewsList();
        });
    });
}

function filterEntries(entries) {
    if (currentFilter === "ALL") {
        return entries;
    }

    if (currentFilter === "Published") {
        return entries.filter(entry =>
            normalizeStatus(entry.status) ===
            "Published"
        );
    }

    if (currentFilter === "Draft") {
        return entries.filter(entry =>
            normalizeStatus(entry.status) ===
            "Draft"
        );
    }

    return entries.filter(entry =>
        normalizeCategory(entry.category) ===
        currentFilter
    );
}


/* =========================================================
   ROW EVENTS
========================================================= */

function attachRowEvents() {
    document
        .querySelectorAll(".edit-action")
        .forEach(button => {
            button.addEventListener("click", () => {
                editEntry(button.dataset.id);
            });
        });

    document
        .querySelectorAll(".delete-action")
        .forEach(button => {
            button.addEventListener("click", () => {
                deleteEntry(button.dataset.id);
            });
        });
}


/* =========================================================
   DESIGN SELECTOR
========================================================= */

function setupDesignSelector() {
    document
        .querySelectorAll(".design-card")
        .forEach(card => {
            card.addEventListener("click", event => {
                event.preventDefault();

                const designId =
                    card.dataset.design;

                if (!designId) {
                    return;
                }

                openNewModal(designId);
            });
        });

    const designSelect =
        document.getElementById("entryDesign");

    if (designSelect) {
        designSelect.addEventListener("change", () => {
            selectDesign(designSelect.value);
        });
    }
}

function selectDesign(designId) {
    if (!VALID_DESIGNS.includes(designId)) {
        designId = "LearningNote";
    }

    selectedDesign = designId;

    setFieldValue("entryDesign", designId);

    hideAllDesignFields();
    updateLearningNoteVisibility();

    if (designId !== "LearningNote") {
        showDesignFields(designId);
    }
}

function hideAllDesignFields() {
    document
        .querySelectorAll(".design-fields")
        .forEach(field => {
            field.style.display = "none";
        });
}

function showDesignFields(designId) {
    const fieldMap = {
        FilmArchiveDesign: "filmArchiveFields",
        VintageFlowerDesign: "vintageFlowerFields",
        HomeBakingDesign: "homeBakingFields",
        MInimalPortfolio: "minimalPortfolioFields",
        ModernMaturityDesign: "modernMaturityFields"
    };

    const fieldId = fieldMap[designId];

    if (!fieldId) {
        return;
    }

    const field = document.getElementById(fieldId);

    if (field) {
        field.style.display = "block";
    }
}

function updateLearningNoteVisibility() {
    const wrapper =
        document.getElementById(
            "entryContentWrapper"
        );

    if (!wrapper) {
        return;
    }

    wrapper.style.display =
        selectedDesign === "LearningNote"
            ? "block"
            : "none";
}


/* =========================================================
   NEW ENTRY
========================================================= */

function setupNewEntryButton() {
    const button =
        document.getElementById("newEntryButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", event => {
        event.preventDefault();
        openNewModal();
    });
}

function openNewModal(
    designId = "LearningNote"
) {
    isEditing = false;

    clearFormForNewEntry();

    selectedDesign = VALID_DESIGNS.includes(designId)
        ? designId
        : "LearningNote";

    setFieldValue("editingEntryId", "");
    setFieldValue("entryDesign", selectedDesign);

    const title =
        document.getElementById("modalTitle");

    if (title) {
        title.textContent = "New Archive Entry";
    }

    const saveButton =
        document.getElementById("saveButton");

    if (saveButton) {
        saveButton.textContent = "Save Entry";
    }

    selectDesign(selectedDesign);
    openModal();
}


/* =========================================================
   EDIT ENTRY
========================================================= */

async function editEntry(entryId) {
    if (!entryId) {
        return;
    }

    try {
        const entryRef = doc(db, "news", entryId);

        const snapshot = await getDoc(entryRef);

        if (!snapshot.exists()) {
            alert("This entry no longer exists.");
            await loadNewsEntries();
            return;
        }

        const entry = snapshot.data();

        const design =
            entry.design ||
            entry.designId ||
            "LearningNote";

        const content =
            getDesignContent(entry);

        isEditing = true;

        // 새 글용 clearForm()을 쓰지 않음
        // 수정용 초기화 후 기존 값을 채움
        resetFormForEdit();

        selectedDesign =
            VALID_DESIGNS.includes(design)
                ? design
                : "LearningNote";

        setFieldValue("editingEntryId", entryId);

        // 공통 정보
        setFieldValue(
            "entryTitle",
            entry.title || ""
        );

        setFieldValue(
            "entryCategory",
            entry.category || "Research"
        );

        setFieldValue(
            "entrySubcategory",
            entry.subcategory || ""
        );

        setFieldValue(
            "entryDescription",
            entry.description ||
            entry.shortDescription ||
            ""
        );

        setFieldValue(
            "entryDate",
            normalizeDateForInput(entry.date)
        );

        setFieldValue(
            "entryStatus",
            normalizeStatus(entry.status)
        );

        setFieldValue(
            "entryImage",
            entry.image ||
            entry.imageUrl ||
            ""
        );

        // 먼저 디자인을 선택해야
        // 해당 디자인의 입력창이 표시됨
        selectDesign(selectedDesign);

        // Learning Note는 문자열 content 사용
        if (selectedDesign === "LearningNote") {
            setFieldValue(
                "entryContent",
                typeof entry.content === "string"
                    ? entry.content
                    : ""
            );
        }

        // Vintage Flower 등은 객체 content 사용
        else {
            populateDesignFields(
                selectedDesign,
                content,
                entry
            );
        }

        const modalTitle =
            document.getElementById("modalTitle");

        if (modalTitle) {
            modalTitle.textContent =
                "Edit Archive Entry";
        }

        const saveButton =
            document.getElementById("saveButton");

        if (saveButton) {
            saveButton.textContent =
                "Update Entry";
        }

        openModal();

    } catch (error) {
        console.error("Failed to edit entry:", error);

        alert(
            "Failed to load this entry.\n\n" +
            error.message
        );
    }
}


/* =========================================================
   FORM RESET
========================================================= */

function clearFormForNewEntry() {
    clearAllInputValues();

    setFieldValue(
        "entryCategory",
        "Research"
    );

    setFieldValue(
        "entryStatus",
        "Published"
    );

    setFieldValue(
        "entryDesign",
        "LearningNote"
    );

    selectedDesign = "LearningNote";

    hideAllDesignFields();
    updateLearningNoteVisibility();
}

function resetFormForEdit() {
    clearAllInputValues();

    hideAllDesignFields();

    const contentWrapper =
        document.getElementById(
            "entryContentWrapper"
        );

    if (contentWrapper) {
        contentWrapper.style.display = "none";
    }
}

function clearAllInputValues() {
    const modal =
        document.getElementById("entryModal");

    if (!modal) {
        return;
    }

    modal
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(field => {
            if (field.type === "hidden") {
                field.value = "";
                return;
            }

            if (field.tagName === "SELECT") {
                return;
            }

            field.value = "";
        });
}


/* =========================================================
   DESIGN CONTENT
========================================================= */

function getDesignContent(entry) {
    if (
        entry &&
        entry.content &&
        typeof entry.content === "object" &&
        !Array.isArray(entry.content)
    ) {
        return entry.content;
    }

    if (
        entry &&
        entry.data &&
        typeof entry.data === "object" &&
        !Array.isArray(entry.data)
    ) {
        return entry.data;
    }

    return {};
}

function populateDesignFields(
    designId,
    content,
    entry
) {
    const data = {
        ...entry,
        ...content
    };

    const fieldMap = {
        FilmArchiveDesign: [
            "filmHeroTitleTop",
            "filmHeroTitleBottom1",
            "filmHeroTitleBottom2",
            "filmHeroImage",
            "filmIntroText",
            "filmMemory1Image",
            "filmMemory1Text",
            "filmMemory2Image",
            "filmMemory2Text",
            "filmMemory3Image",
            "filmMemory3Text",
            "filmMemory4Image",
            "filmMemory4Text",
            "filmVideoUrl",
            "filmVideoCaption",
            "film1Image",
            "film1Title",
            "film1Text",
            "film2Image",
            "film2Title",
            "film2Text",
            "film3Image",
            "film3Title",
            "film3Text",
            "filmTravelMonth",
            "filmTravelYear",
            "filmTravelLocation",
            "filmTravelText"
        ],

        VintageFlowerDesign: [
    "vintageHeroImage",
    "vintageHeroTitle",
    "vintageHeroSubtitle",

    "vintageFlower1Image",
    "vintageFlower1Title",
    "vintageFlower1Text",

    "vintageRibbonImage",
    "vintageRibbonTitle",

    "vintageFlower2Image",
    "vintageFlower2Title",
    "vintageFlower2Text",

    "vintageFlower3Image",
    "vintageFlower3Title",
    "vintageFlower3Text",

    "vintageGallery1Image",
    "vintageGallery1Title",
    "vintageGallery1Text",

    "vintageGallery2Image",
    "vintageGallery2Title",
    "vintageGallery2Text",

    "vintageGallery3Image",
    "vintageJournalTitle",
    "vintageJournalText",

    "vintageGallery4Image"
],

        HomeBakingDesign: [
            "bakingHeroImage",
            "bakingHeroTitle",
            "bakingHeroDescription",
            "bakingSectionTitle",
            "bakingSectionDescription",
            "bakingPolaroid01Image",
            "bakingPolaroid01Title",
            "bakingPolaroid01Description",
            "bakingPolaroid02Image",
            "bakingPolaroid02Title",
            "bakingPolaroid02Description",
            "bakingPolaroid03Image",
            "bakingPolaroid03Title",
            "bakingPolaroid03Description",
            "bakingGallery01Image",
            "bakingGallery02Image",
            "bakingGallery03Image",
            "bakingAboutImage",
            "bakingAboutEyebrow",
            "bakingAboutTitle",
            "bakingAboutDescription",
            "bakingFooterNote",
            "bakingFooterTitle",
            "bakingFooterCopyright"
        ],

        MInimalPortfolio: [
            "minimalHeroImage",
            "minimalHeroEyebrow",
            "minimalHeroTitle",
            "minimalHeroDescription",
            "minimalPlace01Image",
            "minimalPlace01Label",
            "minimalPlace01Title",
            "minimalPlace01Description",
            "minimalStatementEyebrow",
            "minimalStatementTitle",
            "minimalStatementDescription",
            "minimalPlace02Image",
            "minimalPlace02Label",
            "minimalPlace02Title",
            "minimalPlace02Description",
            "minimalGalleryEyebrow",
            "minimalGalleryTitle",
            "minimalGalleryDescription",
            "minimalGallery01Image",
            "minimalGallery02Image",
            "minimalGallery03Image",
            "minimalGallery04Image",
            "minimalGallery05Image",
            "minimalGallery06Image",
            "minimalMovingEyebrow",
            "minimalMovingTitle",
            "minimalMovingDescription",
            "minimalMovingVideo",
            "minimalMovingCaption",
            "minimalFinalEyebrow",
            "minimalFinalTitle",
            "minimalFinalDescription",
            "minimalEndingImage",
            "minimalEndingEyebrow",
            "minimalEndingDescription"
        ],

        ModernMaturityDesign: [
            "modernHeroEyebrow",
            "modernHeroTitle",
            "modernHeroImage",
            "modernHeroQuote",
            "modernHeroDescription",
            "modernSection01Image",
            "modernSection01SubImage",
            "modernSection01Title",
            "modernSection01Description",
            "modernSection02Image01",
            "modernSection02Image02",
            "modernSection02Title",
            "modernSection02Description",
            "modernSection03Image",
            "modernSection03Title",
            "modernSection03Description",
            "modernSection04Image",
            "modernSection04SubImage",
            "modernSection04Title",
            "modernSection04Description"
        ]
    };

    const fields = fieldMap[designId] || [];

    fields.forEach(fieldId => {
        setFieldValue(
            fieldId,
            data[fieldId] ?? ""
        );
    });
}

function collectDesignFields(designId) {
    const fieldMap = {
        FilmArchiveDesign: [
            "filmHeroTitleTop",
            "filmHeroTitleBottom1",
            "filmHeroTitleBottom2",
            "filmHeroImage",
            "filmIntroText",
            "filmMemory1Image",
            "filmMemory1Text",
            "filmMemory2Image",
            "filmMemory2Text",
            "filmMemory3Image",
            "filmMemory3Text",
            "filmMemory4Image",
            "filmMemory4Text",
            "filmVideoUrl",
            "filmVideoCaption",
            "film1Image",
            "film1Title",
            "film1Text",
            "film2Image",
            "film2Title",
            "film2Text",
            "film3Image",
            "film3Title",
            "film3Text",
            "filmTravelMonth",
            "filmTravelYear",
            "filmTravelLocation",
            "filmTravelText"
        ],

            VintageFlowerDesign: [
            "vintageHeroImage",
            "vintageHeroTitle",
            "vintageHeroSubtitle",

            "vintageFlower1Image",
            "vintageFlower1Title",
            "vintageFlower1Text",

            "vintageRibbonImage",
            "vintageRibbonTitle",

            "vintageFlower2Image",
            "vintageFlower2Title",
            "vintageFlower2Text",

            "vintageFlower3Image",
            "vintageFlower3Title",
            "vintageFlower3Text",

            "vintageGallery1Image",
            "vintageGallery1Title",
            "vintageGallery1Text",

            "vintageGallery2Image",
            "vintageGallery2Title",
            "vintageGallery2Text",

            "vintageGallery3Image",
            "vintageJournalTitle",
            "vintageJournalText",

            "vintageGallery4Image"
        ],

        HomeBakingDesign: [
            "bakingHeroImage",
            "bakingHeroTitle",
            "bakingHeroDescription",
            "bakingSectionTitle",
            "bakingSectionDescription",
            "bakingPolaroid01Image",
            "bakingPolaroid01Title",
            "bakingPolaroid01Description",
            "bakingPolaroid02Image",
            "bakingPolaroid02Title",
            "bakingPolaroid02Description",
            "bakingPolaroid03Image",
            "bakingPolaroid03Title",
            "bakingPolaroid03Description",
            "bakingGallery01Image",
            "bakingGallery02Image",
            "bakingGallery03Image",
            "bakingAboutImage",
            "bakingAboutEyebrow",
            "bakingAboutTitle",
            "bakingAboutDescription",
            "bakingFooterNote",
            "bakingFooterTitle",
            "bakingFooterCopyright"
        ],

        MInimalPortfolio: [
            "minimalHeroImage",
            "minimalHeroEyebrow",
            "minimalHeroTitle",
            "minimalHeroDescription",
            "minimalPlace01Image",
            "minimalPlace01Label",
            "minimalPlace01Title",
            "minimalPlace01Description",
            "minimalStatementEyebrow",
            "minimalStatementTitle",
            "minimalStatementDescription",
            "minimalPlace02Image",
            "minimalPlace02Label",
            "minimalPlace02Title",
            "minimalPlace02Description",
            "minimalGalleryEyebrow",
            "minimalGalleryTitle",
            "minimalGalleryDescription",
            "minimalGallery01Image",
            "minimalGallery02Image",
            "minimalGallery03Image",
            "minimalGallery04Image",
            "minimalGallery05Image",
            "minimalGallery06Image",
            "minimalMovingEyebrow",
            "minimalMovingTitle",
            "minimalMovingDescription",
            "minimalMovingVideo",
            "minimalMovingCaption",
            "minimalFinalEyebrow",
            "minimalFinalTitle",
            "minimalFinalDescription",
            "minimalEndingImage",
            "minimalEndingEyebrow",
            "minimalEndingDescription"
        ],

        ModernMaturityDesign: [
            "modernHeroEyebrow",
            "modernHeroTitle",
            "modernHeroImage",
            "modernHeroQuote",
            "modernHeroDescription",
            "modernSection01Image",
            "modernSection01SubImage",
            "modernSection01Title",
            "modernSection01Description",
            "modernSection02Image01",
            "modernSection02Image02",
            "modernSection02Title",
            "modernSection02Description",
            "modernSection03Image",
            "modernSection03Title",
            "modernSection03Description",
            "modernSection04Image",
            "modernSection04SubImage",
            "modernSection04Title",
            "modernSection04Description"
        ]
    };

    const fieldIds = fieldMap[designId] || {};
    const content = {};

    fieldIds.forEach(fieldId => {
        content[fieldId] =
            getFieldValue(fieldId);
    });

    return content;
}


/* =========================================================
   SAVE / UPDATE
========================================================= */

function setupSaveButton() {
    const saveButton =
        document.getElementById("saveButton");

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener("click", async event => {
        event.preventDefault();

        if (saveButton.dataset.saving === "true") {
            return;
        }

        saveButton.dataset.saving = "true";

        try {
            await saveEntry();
        } finally {
            saveButton.dataset.saving = "false";
        }
    });
}

async function saveEntry() {
    const saveButton =
        document.getElementById("saveButton");

    const editingId =
        getFieldValue("editingEntryId").trim();

    const wasEditing = Boolean(editingId);

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
    }

    try {
        const title =
            getFieldValue("entryTitle").trim();

        if (!title) {
            alert("Please enter a title.");
            return;
        }

        const design =
            getFieldValue("entryDesign") ||
            selectedDesign;

        const content =
            design === "LearningNote"
                ? getFieldValue("entryContent")
                : collectDesignFields(design);

        const entryData = {
            title,
            category:
                getFieldValue("entryCategory"),
            subcategory:
                getFieldValue(
                    "entrySubcategory"
                ).trim(),
            design,
            description:
                getFieldValue(
                    "entryDescription"
                ),
            date:
                getFieldValue("entryDate"),
            status:
                getFieldValue("entryStatus"),
            image:
                getFieldValue("entryImage"),
            content,
            updatedAt: serverTimestamp()
        };

        if (wasEditing) {
            await updateDoc(
                doc(db, "news", editingId),
                entryData
            );

            alert("Entry updated successfully.");
        } else {
            entryData.createdAt = serverTimestamp();

            await addDoc(
                collection(db, "news"),
                entryData
            );

            alert(
                "New entry created successfully."
            );
        }

        closeModal();
        await loadNewsEntries();

    } catch (error) {
        console.error("Save error:", error);

        alert(
            "Failed to save entry.\n\n" +
            error.message
        );

    } finally {
        if (saveButton) {
            saveButton.disabled = false;

            saveButton.textContent =
                wasEditing
                    ? "Update Entry"
                    : "Save Entry";
        }
    }
}


/* =========================================================
   MODAL
========================================================= */

function setupModalEvents() {
    const modal =
        document.getElementById("entryModal");

    if (!modal) {
        return;
    }

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeModal();
        }
    });
}

function openModal() {
    const modal =
        document.getElementById("entryModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";

    const modalBox =
        modal.querySelector(".modal-box");

    if (modalBox) {
        modalBox.scrollTop = 0;
    }
}

function closeModal() {
    const modal =
        document.getElementById("entryModal");

    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "";
    }

    document.body.style.overflow = "";
    isEditing = false;
}


/* =========================================================
   DELETE
========================================================= */

async function deleteEntry(entryId) {
    if (!entryId) {
        return;
    }

    const entry = allEntries.find(
        item => item.id === entryId
    );

    const title =
        entry?.title || "this entry";

    const confirmed = confirm(
        `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    try {
        await deleteDoc(
            doc(db, "news", entryId)
        );

        alert("Entry deleted successfully.");

        await loadNewsEntries();

    } catch (error) {
        console.error("Delete error:", error);

        alert(
            "Failed to delete entry.\n\n" +
            error.message
        );
    }
}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {
    const total = allEntries.length;

    const published = allEntries.filter(entry =>
        normalizeStatus(entry.status) ===
        "Published"
    ).length;

    const drafts = allEntries.filter(entry =>
        normalizeStatus(entry.status) ===
        "Draft"
    ).length;

    const now = new Date();

    const thisMonth = allEntries.filter(entry => {
        const value = getEntryDateValue(entry);

        if (!value) {
            return false;
        }

        const date = new Date(value);

        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth()
        );
    }).length;

    setText("totalPosts", total);
    setText("publishedPosts", published);
    setText("draftPosts", drafts);

    setText(
        "thisMonthPosts",
        String(thisMonth).padStart(2, "0")
    );
}


/* =========================================================
   UTILITIES (에디터 HTML 읽기/쓰기 지원 수정)
========================================================= */

function getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return "";

    // contenteditable div 에디터인 경우 innerHTML 반환
    if (field.isContentEditable || field.getAttribute("contenteditable") === "true") {
        return field.innerHTML || "";
    }

    return field.value || "";
}

function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const val = (value === null || value === undefined) ? "" : String(value);

    // contenteditable div 에디터인 경우 innerHTML 설정
    if (field.isContentEditable || field.getAttribute("contenteditable") === "true") {
        field.innerHTML = val;
    } else {
        field.value = val;
    }
}

/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openNewModal = openNewModal;
window.closeModal = closeModal;
window.selectDesign = selectDesign;
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
window.saveEntry = saveEntry;
window.refreshNewsAdmin = loadNewsEntries;
