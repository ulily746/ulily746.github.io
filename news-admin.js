/* =========================================================
NEWS ADMIN.JS
Personal Archive — News Admin
========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_d4etBdBcvBRhTJlD3cLssN309LAdlfg",
    authDomain: "yuri-research-portfolio.firebaseapp.com",
    projectId: "yuri-research-portfolio",
    storageBucket: "yuri-research-portfolio.firebasestorage.app",
    messagingSenderId: "231317507996",
    appId: "1:231317507996:web:9773282c138706d886c259",
    measurementId: "G-57VHW2454"
};

// 여기서 바로 db를 export 하거나 상수로 들고 있습니다.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


/* =========================================================
GLOBAL STATE
========================================================= */

let allEntries = [];
let currentFilter = "ALL";
let selectedDesign = "FilmArchiveDesign";
let isEditing = false;


/* =========================================================
DOM READY
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    console.log("News Admin initializing...");

    initializeAdmin();
});
/* =========================================================
INITIALIZE ADMIN
========================================================= */

function initializeAdmin() {

    console.log(
        "Firebase DB ready:",
        !!db
    );

    if (!db) {

        console.error(
            "Firebase Database could not be initialized."
        );

        showFirebaseError(
            new Error(
                "Firebase Database is not available."
            )
        );

        return;
    }

    setupFilters();

    setupDesignSelector();

    setupModalEvents();

    setupNewEntryButtons();

    setupSaveButton();

    setupCloseButtons();

    loadNewsEntries();

    console.log(
        "News Admin initialized successfully."
    );

}
/* =========================================================
FIREBASE ERROR
========================================================= */

function showFirebaseError(error) {

const list =
    document.getElementById("newsList");

if (!list) {
    return;
}

list.innerHTML = `
    <div class="empty-state">
        <div class="empty-state-title">
            Firebase Connection Error
        </div>

        <div class="empty-state-text">
            ${escapeHTML(
                error?.message ||
                "Unable to connect to Firebase."
            )}
        </div>
    </div>
`;

}

/* =========================================================
LOAD NEWS ENTRIES
========================================================= */

async function loadNewsEntries() {

const list =
    document.getElementById("newsList");

if (list) {
    list.innerHTML = `
        <div class="loading-state">
            LOADING ARCHIVE...
        </div>
    `;
}

if (!db) {
    showFirebaseError(
        new Error("Firebase is not ready.")
    );
    return;
}

try {

    const newsRef =
        collection(
            db,
            "news"
        );

    let snapshot;

    try {

        const orderedQuery =
            query(
                newsRef,
                orderBy(
                    "date",
                    "desc"
                )
            );

        snapshot =
            await getDocs(
                orderedQuery
            );

    } catch (error) {

        console.warn(
            "orderBy failed. Loading without sorting.",
            error
        );

        snapshot =
            await getDocs(
                newsRef
            );
    }

    allEntries = [];

    snapshot.forEach(
        documentSnapshot => {

            if (
                documentSnapshot.id ===
                "design"
            ) {
                return;
            }

            const data =
                documentSnapshot.data();

            allEntries.push({
                id:
                    documentSnapshot.id,
                ...data
            });
        }
    );

    allEntries.sort(
        sortEntriesByDate
    );

    updateStatistics();

    renderNewsList();

    console.log(
        "News entries loaded:",
        allEntries.length
    );

} catch (error) {

    console.error(
        "Failed to load news:",
        error
    );

    if (list) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">
                    Unable to Load Archive
                </div>

                <div class="empty-state-text">
                    ${escapeHTML(
                        error?.message ||
                        "Please check Firebase configuration."
                    )}
                </div>
            </div>
        `;
    }
}

}

/* =========================================================
SORT
========================================================= */

function sortEntriesByDate(a, b) {

return (
    getEntryDateValue(b) -
    getEntryDateValue(a)
);

}

function getEntryDateValue(entry) {

if (!entry) {
    return 0;
}

const value =
    entry.date ||
    entry.createdAt ||
    entry.updatedAt;

if (
    value &&
    typeof value.toDate ===
    "function"
) {
    return value
        .toDate()
        .getTime();
}

if (
    value instanceof Date
) {
    return value.getTime();
}

if (
    typeof value === "string"
) {
    const time =
        new Date(
            value
        ).getTime();

    return Number.isNaN(time)
        ? 0
        : time;
}

if (
    typeof value === "number"
) {
    return value;
}

return 0;

}

/* =========================================================
RENDER LIST
========================================================= */

function renderNewsList() {

const list =
    document.getElementById(
        "newsList"
    );

if (!list) {
    return;
}

const filteredEntries =
    filterEntries(
        allEntries
    );

if (
    filteredEntries.length === 0
) {

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

list.innerHTML =
    filteredEntries
        .map(
            createNewsRow
        )
        .join("");

attachRowEvents();

}

/* =========================================================
FILTER
========================================================= */

function filterEntries(entries) {

if (
    currentFilter ===
    "ALL"
) {
    return entries;
}

if (
    currentFilter ===
    "Published"
) {
    return entries.filter(
        entry =>
            normalizeStatus(
                entry.status
            ) ===
            "Published"
    );
}

if (
    currentFilter ===
    "Draft"
) {
    return entries.filter(
        entry =>
            normalizeStatus(
                entry.status
            ) ===
            "Draft"
    );
}

return entries.filter(
    entry =>
        normalizeCategory(
            entry.category
        ) ===
        currentFilter
);
}

/* =========================================================
CREATE NEWS ROW
========================================================= */

function createNewsRow(entry) {

const id =
    entry.id ||
    "";

const title =
    entry.title ||
    entry.name ||
    "Untitled Entry";

const category =
    normalizeCategory(
        entry.category
    );

const design =
    entry.design ||
    entry.designId ||
    "Unknown Design";

const status =
    normalizeStatus(
        entry.status
    );

const image =
    entry.image ||
    entry.imageUrl ||
    entry.heroImage ||
    getContentValue(
        entry,
        "heroImage"
    ) ||
    getContentValue(
        entry,
        "minimalHeroImage"
    ) ||
    getContentValue(
        entry,
        "vintageHeroImage"
    ) ||
    getContentValue(
        entry,
        "bakingHeroImage"
    ) ||
    getContentValue(
        entry,
        "filmHeroImage"
    ) ||
    getContentValue(
        entry,
        "modernHeroImage"
    ) ||
    "";

const description =
    entry.description ||
    entry.shortDescription ||
    "";

const date =
    formatDate(
        entry.date
    );

const statusClass =
    status ===
    "Published"
        ? "status-published"
        : "status-draft";

const safeId =
    escapeHTML(
        id
    );

return `
    <div
        class="news-row"
        data-entry-id="${safeId}"
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
                    getDesignDisplayName(
                        design
                    )
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
                    data-id="${safeId}"
                >
                    EDIT
                </span>

                <span
                    class="action delete delete-action"
                    data-id="${safeId}"
                >
                    DELETE
                </span>

            </div>
        </div>

    </div>
`;


}

/* =========================================================
ROW EVENTS
========================================================= */

function attachRowEvents() {

document
    .querySelectorAll(
        ".edit-action"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    editEntry(
                        button.dataset.id
                    );
                }
            );
        }
    );

document
    .querySelectorAll(
        ".delete-action"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    deleteEntry(
                        button.dataset.id
                    );
                }
            );
        }
    );

}

/* =========================================================
FILTER SETUP
========================================================= */

function setupFilters() {

document
    .querySelectorAll(
        ".filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    document
                        .querySelectorAll(
                            ".filter"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                    currentFilter =
                        button.dataset.filter ||
                        "ALL";

                    renderNewsList();
                }
            );
        }
    );


}

/* =========================================================
NEW ENTRY BUTTONS
========================================================= */

function setupNewEntryButtons() {

const selectors = [
    "#newEntryButton",
    "#newEntryBtn",
    ".new-entry-button",
    ".new-entry-btn",
    "[data-action='new-entry']"
];

const buttons =
    document.querySelectorAll(
        selectors.join(",")
    );

buttons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openNewModal();
            }
        );
    }
);

}

/* =========================================================
SAVE BUTTON
========================================================= */

function setupSaveButton() {

const button =
    document.getElementById(
        "saveButton"
    );

if (!button) {
    return;
}

button.addEventListener(
    "click",
    event => {

        event.preventDefault();

        saveEntry();
    }
);


}

/* =========================================================
CLOSE BUTTONS
========================================================= */

function setupCloseButtons() {

document
    .querySelectorAll(
        "[data-close-modal], .modal-close, .close-modal"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeModal();
                }
            );
        }
    );

}

/* =========================================================
DESIGN SELECTOR
========================================================= */

function setupDesignSelector() {

document
    .querySelectorAll(
        ".design-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const designId =
                        card.dataset.design ||
                        card.dataset.designId ||
                        getDesignFromOnClick(
                            card
                        );

                    if (!designId) {
                        return;
                    }

                    openNewModal(
                        designId
                    );
                }
            );
        }
    );

const select =
    document.getElementById(
        "entryDesign"
    );

if (select) {

    select.addEventListener(
        "change",
        () => {

            selectDesign(
                select.value
            );
        }
    );
}


}

function getDesignFromOnClick(card) {

const value =
    card.getAttribute(
        "onclick"
    );

if (!value) {
    return "";
}

const match =
    value.match(
        /selectDesign\(['"]([^'"]+)['"]\)/
    );

return match
    ? match[1]
    : "";


}

/* =========================================================
DESIGN CHANGE
========================================================= */

function handleDesignChange() {

const select =
    document.getElementById(
        "entryDesign"
    );

if (!select) {
    return;
}

selectDesign(
    select.value
);

}

/* =========================================================
SELECT DESIGN
========================================================= */

function selectDesign(
designId
) {

selectedDesign =
    designId ||
    "FilmArchiveDesign";

const select =
    document.getElementById(
        "entryDesign"
    );

if (
    select &&
    select.value !==
    selectedDesign
) {
    select.value =
        selectedDesign;
}

hideAllDesignFields();

showDesignFields(
    selectedDesign
);

}

/* =========================================================
HIDE DESIGN FIELDS
========================================================= */

function hideAllDesignFields() {


document
    .querySelectorAll(
        ".design-fields"
    )
    .forEach(
        field => {

            field.style.display =
                "none";
        }
    );

}

/* =========================================================
SHOW DESIGN FIELDS
========================================================= */

function showDesignFields(
designId
) {


const fieldMap = {

    FilmArchiveDesign:
        "filmArchiveFields",

    VintageFlowerDesign:
        "vintageFlowerFields",

    HomeBakingDesign:
        "homeBakingFields",

    MInimalPortfolio:
        "minimalPortfolioFields",

    ModernMaturityDesign:
        "modernMaturityFields"
};

const fieldId =
    fieldMap[
        designId
    ];

if (!fieldId) {

    console.warn(
        "Unknown design:",
        designId
    );

    return;
}

const field =
    document.getElementById(
        fieldId
    );

if (field) {

    field.style.display =
        "block";
}


}

/* =========================================================
OPEN NEW MODAL
========================================================= */

function openNewModal(
designId = null
) {

isEditing =
    false;

selectedDesign =
    designId ||
    "FilmArchiveDesign";

clearForm();

const editingId =
    document.getElementById(
        "editingEntryId"
    );

if (editingId) {
    editingId.value = "";
}

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

if (modalTitle) {

    modalTitle.textContent =
        "New Archive Entry";
}

const saveButton =
    document.getElementById(
        "saveButton"
    );

if (saveButton) {

    saveButton.textContent =
        "Save Entry";
}

selectDesign(
    selectedDesign
);

openModal();

}

/* =========================================================
OPEN MODAL
========================================================= */

function openModal() {

const modal =
    document.getElementById(
        "entryModal"
    );

if (!modal) {

    console.warn(
        "entryModal not found."
    );

    return;
}

modal.classList.add(
    "active"
);

modal.style.display =
    "flex";

document.body.style.overflow =
    "hidden";

}

/* =========================================================
CLOSE MODAL
========================================================= */

function closeModal() {

const modal =
    document.getElementById(
        "entryModal"
    );

if (modal) {

    modal.classList.remove(
        "active"
    );

    modal.style.display =
        "";
}

document.body.style.overflow =
    "";

isEditing =
    false;
}

/* =========================================================
MODAL EVENTS
========================================================= */

function setupModalEvents() {

const modal =
    document.getElementById(
        "entryModal"
    );

if (!modal) {
    return;
}

modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            closeModal();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape" &&
            modal.classList.contains(
                "active"
            )
        ) {

            closeModal();
        }
    }
);

}

/* =========================================================
EDIT ENTRY
========================================================= */

async function editEntry(
entryId
) {

if (!entryId) {
    return;
}

if (!db) {

    alert(
        "Firebase is not ready yet."
    );

    return;
}

try {

    const entryRef =
        doc(
            db,
            "news",
            entryId
        );

    const snapshot =
        await getDoc(
            entryRef
        );

    if (
        !snapshot.exists()
    ) {

        alert(
            "This entry no longer exists."
        );

        await loadNewsEntries();

        return;
    }

    const entry =
        snapshot.data();

    isEditing =
        true;

    selectedDesign =
        entry.design ||
        entry.designId ||
        "FilmArchiveDesign";

    clearForm();

    setFieldValue(
        "editingEntryId",
        entryId
    );

    setFieldValue(
        "entryTitle",
        entry.title ||
        ""
    );

    setFieldValue(
        "entryCategory",
        entry.category ||
        "Research"
    );

    setFieldValue(
        "entryDescription",
        entry.description ||
        entry.shortDescription ||
        ""
    );

    setFieldValue(
        "entryDate",
        normalizeDateForInput(
            entry.date
        )
    );

    setFieldValue(
        "entryStatus",
        normalizeStatus(
            entry.status
        )
    );

    setFieldValue(
        "entryImage",
        entry.image ||
        entry.imageUrl ||
        entry.heroImage ||
        ""
    );

    setFieldValue(
        "entryDesign",
        selectedDesign
    );

    const content =
        getDesignContent(
            entry
        );

    populateDesignFields(
        selectedDesign,
        content,
        entry
    );

    selectDesign(
        selectedDesign
    );

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

    if (modalTitle) {

        modalTitle.textContent =
            "Edit Archive Entry";
    }

    const saveButton =
        document.getElementById(
            "saveButton"
        );

    if (saveButton) {

        saveButton.textContent =
            "Update Entry";
    }

    openModal();

    console.log(
        "Entry loaded for editing:",
        entryId
    );

} catch (error) {

    console.error(
        "Failed to edit entry:",
        error
    );

    alert(
        "Failed to load this entry.\n\n" +
        error.message
    );
}


}

/* =========================================================
GET DESIGN CONTENT
========================================================= */

function getDesignContent(
entry
) {

if (
    entry &&
    entry.content &&
    typeof entry.content ===
    "object"
) {
    return entry.content;
}

if (
    entry &&
    entry.data &&
    typeof entry.data ===
    "object"
) {
    return entry.data;
}

return entry || {};

}

/* =========================================================
POPULATE DESIGN FIELDS
========================================================= */

function populateDesignFields(
designId,
content,
entry
) {

const data = {
    ...entry,
    ...content
};

if (
    designId ===
    "FilmArchiveDesign"
) {
    populateFilmArchive(
        data
    );
}

else if (
    designId ===
    "VintageFlowerDesign"
) {
    populateVintageFlower(
        data
    );
}

else if (
    designId ===
    "HomeBakingDesign"
) {
    populateHomeBaking(
        data
    );
}

else if (
    designId ===
    "MInimalPortfolio"
) {
    populateMinimalPortfolio(
        data
    );
}

else if (
    designId ===
    "ModernMaturityDesign"
) {
    populateModernMaturity(
        data
    );
}

}

/* =========================================================
FILM ARCHIVE
========================================================= */

function populateFilmArchive(
data
) {


populateFields({

    filmHeroTitleTop:
        getValue(
            data,
            "filmHeroTitleTop"
        ),

    filmHeroTitleBottom1:
        getValue(
            data,
            "filmHeroTitleBottom1"
        ),

    filmHeroTitleBottom2:
        getValue(
            data,
            "filmHeroTitleBottom2"
        ),

    filmHeroImage:
        getValue(
            data,
            "filmHeroImage",
            "heroImage"
        ),

    filmIntroText:
        getValue(
            data,
            "filmIntroText",
            "introText"
        ),

    filmMemory1Image:
        getValue(
            data,
            "filmMemory1Image"
        ),

    filmMemory1Text:
        getValue(
            data,
            "filmMemory1Text"
        ),

    filmMemory2Image:
        getValue(
            data,
            "filmMemory2Image"
        ),

    filmMemory2Text:
        getValue(
            data,
            "filmMemory2Text"
        ),

    filmMemory3Image:
        getValue(
            data,
            "filmMemory3Image"
        ),

    filmMemory3Text:
        getValue(
            data,
            "filmMemory3Text"
        ),

    filmMemory4Image:
        getValue(
            data,
            "filmMemory4Image"
        ),

    filmMemory4Text:
        getValue(
            data,
            "filmMemory4Text"
        ),

    filmVideoUrl:
        getValue(
            data,
            "filmVideoUrl",
            "videoUrl"
        ),

    filmVideoCaption:
        getValue(
            data,
            "filmVideoCaption",
            "videoCaption"
        ),

    film1Image:
        getValue(
            data,
            "film1Image"
        ),

    film1Title:
        getValue(
            data,
            "film1Title"
        ),

    film1Text:
        getValue(
            data,
            "film1Text"
        ),

    film2Image:
        getValue(
            data,
            "film2Image"
        ),

    film2Title:
        getValue(
            data,
            "film2Title"
        ),

    film2Text:
        getValue(
            data,
            "film2Text"
        ),

    film3Image:
        getValue(
            data,
            "film3Image"
        ),

    film3Title:
        getValue(
            data,
            "film3Title"
        ),

    film3Text:
        getValue(
            data,
            "film3Text"
        ),

    filmTravelMonth:
        getValue(
            data,
            "filmTravelMonth"
        ),

    filmTravelYear:
        getValue(
            data,
            "filmTravelYear"
        ),

    filmTravelLocation:
        getValue(
            data,
            "filmTravelLocation"
        ),

    filmTravelText:
        getValue(
            data,
            "filmTravelText"
        )
});


}

/* =========================================================
VINTAGE FLOWER
========================================================= */

function populateVintageFlower(
data
) {

populateFields({

    vintageHeroImage:
        getValue(
            data,
            "vintageHeroImage",
            "heroImage"
        ),

    vintageHeroTitle:
        getValue(
            data,
            "vintageHeroTitle",
            "heroTitle"
        ),

    vintageHeroSubtitle:
        getValue(
            data,
            "vintageHeroSubtitle",
            "heroSubtitle"
        ),

    vintageIntroTitle:
        getValue(
            data,
            "vintageIntroTitle",
            "introTitle"
        ),

    vintageIntroText:
        getValue(
            data,
            "vintageIntroText",
            "introText"
        ),

    vintageFlower1Image:
        getValue(
            data,
            "vintageFlower1Image"
        ),

    vintageFlower1Title:
        getValue(
            data,
            "vintageFlower1Title"
        ),

    vintageFlower1Text:
        getValue(
            data,
            "vintageFlower1Text"
        ),

    vintageFlower2Image:
        getValue(
            data,
            "vintageFlower2Image"
        ),

    vintageFlower2Title:
        getValue(
            data,
            "vintageFlower2Title"
        ),

    vintageFlower2Text:
        getValue(
            data,
            "vintageFlower2Text"
        ),

    vintageFlower3Image:
        getValue(
            data,
            "vintageFlower3Image"
        ),

    vintageFlower3Title:
        getValue(
            data,
            "vintageFlower3Title"
        ),

    vintageFlower3Text:
        getValue(
            data,
            "vintageFlower3Text"
        ),

    vintageJournalTitle:
        getValue(
            data,
            "vintageJournalTitle"
        ),

    vintageJournalText:
        getValue(
            data,
            "vintageJournalText"
        ),

    vintageGallery1Image:
        getValue(
            data,
            "vintageGallery1Image"
        ),

    vintageGallery2Image:
        getValue(
            data,
            "vintageGallery2Image"
        ),

    vintageGallery3Image:
        getValue(
            data,
            "vintageGallery3Image"
        ),

    vintageGallery4Image:
        getValue(
            data,
            "vintageGallery4Image"
        )
});


}

/* =========================================================
HOME BAKING
========================================================= */

function populateHomeBaking(
data
) {


populateFields({

    bakingHeroImage:
        getValue(
            data,
            "bakingHeroImage",
            "heroImage"
        ),

    bakingHeroTitle:
        getValue(
            data,
            "bakingHeroTitle",
            "heroTitle"
        ),

    bakingHeroDescription:
        getValue(
            data,
            "bakingHeroDescription",
            "heroDescription"
        ),

    bakingSectionTitle:
        getValue(
            data,
            "bakingSectionTitle"
        ),

    bakingSectionDescription:
        getValue(
            data,
            "bakingSectionDescription"
        ),

    bakingPolaroid01Image:
        getValue(
            data,
            "bakingPolaroid01Image"
        ),

    bakingPolaroid01Title:
        getValue(
            data,
            "bakingPolaroid01Title"
        ),

    bakingPolaroid01Description:
        getValue(
            data,
            "bakingPolaroid01Description"
        ),

    bakingPolaroid02Image:
        getValue(
            data,
            "bakingPolaroid02Image"
        ),

    bakingPolaroid02Title:
        getValue(
            data,
            "bakingPolaroid02Title"
        ),

    bakingPolaroid02Description:
        getValue(
            data,
            "bakingPolaroid02Description"
        ),

    bakingPolaroid03Image:
        getValue(
            data,
            "bakingPolaroid03Image"
        ),

    bakingPolaroid03Title:
        getValue(
            data,
            "bakingPolaroid03Title"
        ),

    bakingPolaroid03Description:
        getValue(
            data,
            "bakingPolaroid03Description"
        ),

    bakingGallery01Image:
        getValue(
            data,
            "bakingGallery01Image"
        ),

    bakingGallery02Image:
        getValue(
            data,
            "bakingGallery02Image"
        ),

    bakingGallery03Image:
        getValue(
            data,
            "bakingGallery03Image"
        ),

    bakingAboutImage:
        getValue(
            data,
            "bakingAboutImage"
        ),

    bakingAboutEyebrow:
        getValue(
            data,
            "bakingAboutEyebrow"
        ),

    bakingAboutTitle:
        getValue(
            data,
            "bakingAboutTitle"
        ),

    bakingAboutDescription:
        getValue(
            data,
            "bakingAboutDescription"
        ),

    bakingFooterNote:
        getValue(
            data,
            "bakingFooterNote"
        ),

    bakingFooterTitle:
        getValue(
            data,
            "bakingFooterTitle"
        ),

    bakingFooterCopyright:
        getValue(
            data,
            "bakingFooterCopyright"
        )
});


}

/* =========================================================
MINIMAL PORTFOLIO
Firebase ID = MInimalPortfolio
========================================================= */

function populateMinimalPortfolio(
data
) {


populateFields({

    minimalHeroImage:
        getValue(
            data,
            "minimalHeroImage",
            "heroImage"
        ),

    minimalHeroEyebrow:
        getValue(
            data,
            "minimalHeroEyebrow",
            "heroEyebrow"
        ),

    minimalHeroTitle:
        getValue(
            data,
            "minimalHeroTitle",
            "heroTitle"
        ),

    minimalHeroDescription:
        getValue(
            data,
            "minimalHeroDescription",
            "heroDescription"
        ),

    minimalPlace01Image:
        getValue(
            data,
            "minimalPlace01Image"
        ),

    minimalPlace01Label:
        getValue(
            data,
            "minimalPlace01Label"
        ),

    minimalPlace01Title:
        getValue(
            data,
            "minimalPlace01Title"
        ),

    minimalPlace01Description:
        getValue(
            data,
            "minimalPlace01Description"
        ),

    minimalStatementEyebrow:
        getValue(
            data,
            "minimalStatementEyebrow"
        ),

    minimalStatementTitle:
        getValue(
            data,
            "minimalStatementTitle"
        ),

    minimalStatementDescription:
        getValue(
            data,
            "minimalStatementDescription"
        ),

    minimalPlace02Image:
        getValue(
            data,
            "minimalPlace02Image"
        ),

    minimalPlace02Label:
        getValue(
            data,
            "minimalPlace02Label"
        ),

    minimalPlace02Title:
        getValue(
            data,
            "minimalPlace02Title"
        ),

    minimalPlace02Description:
        getValue(
            data,
            "minimalPlace02Description"
        ),

    minimalGalleryEyebrow:
        getValue(
            data,
            "minimalGalleryEyebrow"
        ),

    minimalGalleryTitle:
        getValue(
            data,
            "minimalGalleryTitle"
        ),

    minimalGalleryDescription:
        getValue(
            data,
            "minimalGalleryDescription"
        ),

    minimalGallery01Image:
        getValue(
            data,
            "minimalGallery01Image"
        ),

    minimalGallery02Image:
        getValue(
            data,
            "minimalGallery02Image"
        ),

    minimalGallery03Image:
        getValue(
            data,
            "minimalGallery03Image"
        ),

    minimalGallery04Image:
        getValue(
            data,
            "minimalGallery04Image"
        ),

    minimalGallery05Image:
        getValue(
            data,
            "minimalGallery05Image"
        ),

    minimalGallery06Image:
        getValue(
            data,
            "minimalGallery06Image"
        ),

    minimalMovingEyebrow:
        getValue(
            data,
            "minimalMovingEyebrow"
        ),

    minimalMovingTitle:
        getValue(
            data,
            "minimalMovingTitle"
        ),

    minimalMovingDescription:
        getValue(
            data,
            "minimalMovingDescription"
        ),

    minimalMovingVideo:
        getValue(
            data,
            "minimalMovingVideo"
        ),

    minimalMovingCaption:
        getValue(
            data,
            "minimalMovingCaption"
        ),

    minimalFinalEyebrow:
        getValue(
            data,
            "minimalFinalEyebrow"
        ),

    minimalFinalTitle:
        getValue(
            data,
            "minimalFinalTitle"
        ),

    minimalFinalDescription:
        getValue(
            data,
            "minimalFinalDescription"
        ),

    minimalEndingImage:
        getValue(
            data,
            "minimalEndingImage"
        ),

    minimalEndingEyebrow:
        getValue(
            data,
            "minimalEndingEyebrow"
        ),

    minimalEndingDescription:
        getValue(
            data,
            "minimalEndingDescription"
        )
});


}

/* =========================================================
MODERN MATURITY
========================================================= */

function populateModernMaturity(
data
) {

populateFields({

    modernHeroEyebrow:
        getValue(
            data,
            "modernHeroEyebrow"
        ),

    modernHeroTitle:
        getValue(
            data,
            "modernHeroTitle"
        ),

    modernHeroImage:
        getValue(
            data,
            "modernHeroImage",
            "heroImage"
        ),

    modernHeroQuote:
        getValue(
            data,
            "modernHeroQuote"
        ),

    modernHeroDescription:
        getValue(
            data,
            "modernHeroDescription"
        ),

    modernSection01Image:
        getValue(
            data,
            "modernSection01Image"
        ),

    modernSection01SubImage:
        getValue(
            data,
            "modernSection01SubImage"
        ),

    modernSection01Title:
        getValue(
            data,
            "modernSection01Title"
        ),

    modernSection01Description:
        getValue(
            data,
            "modernSection01Description"
        ),

    modernSection02Image01:
        getValue(
            data,
            "modernSection02Image01"
        ),

    modernSection02Image02:
        getValue(
            data,
            "modernSection02Image02"
        ),

    modernSection02Title:
        getValue(
            data,
            "modernSection02Title"
        ),

    modernSection02Description:
        getValue(
            data,
            "modernSection02Description"
        ),

    modernSection03Image:
        getValue(
            data,
            "modernSection03Image"
        ),

    modernSection03Title:
        getValue(
            data,
            "modernSection03Title"
        ),

    modernSection03Description:
        getValue(
            data,
            "modernSection03Description"
        ),

    modernSection04Image:
        getValue(
            data,
            "modernSection04Image"
        ),

    modernSection04SubImage:
        getValue(
            data,
            "modernSection04SubImage"
        ),

    modernSection04Title:
        getValue(
            data,
            "modernSection04Title"
        ),

    modernSection04Description:
        getValue(
            data,
            "modernSection04Description"
        )
});

}

/* =========================================================
GENERIC POPULATE
========================================================= */

function populateFields(
fields
) {

Object.entries(
    fields
).forEach(
    (
        [
            fieldId,
            value
        ]
    ) => {

        setFieldValue(
            fieldId,
            value
        );
    }
);
}

/* =========================================================
GET VALUE
========================================================= */

function getValue(
data,
...keys
) {

for (
    const key of keys
) {

    if (
        data &&
        data[key] !== undefined &&
        data[key] !== null
    ) {

        return data[key];
    }
}

return "";


}

/* =========================================================
SET FIELD VALUE
========================================================= */

function setFieldValue(
fieldId,
value
) {

const field =
    document.getElementById(
        fieldId
    );

if (!field) {
    return;
}

if (
    value === null ||
    value === undefined
) {

    field.value =
        "";

    return;
}

if (
    value &&
    typeof value.toDate ===
    "function"
) {

    field.value =
        normalizeDateForInput(
            value
        );

    return;
}

field.value =
    String(
        value
    );


}

/* =========================================================
CLEAR FORM
========================================================= */

function clearForm() {

const formIds = [

    "editingEntryId",
    "entryTitle",
    "entryDescription",
    "entryDate",
    "entryImage",

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
    "filmTravelText",

    "vintageHeroImage",
    "vintageHeroTitle",
    "vintageHeroSubtitle",
    "vintageIntroTitle",
    "vintageIntroText",

    "vintageFlower1Image",
    "vintageFlower1Title",
    "vintageFlower1Text",
    "vintageFlower2Image",
    "vintageFlower2Title",
    "vintageFlower2Text",
    "vintageFlower3Image",
    "vintageFlower3Title",
    "vintageFlower3Text",

    "vintageJournalTitle",
    "vintageJournalText",

    "vintageGallery1Image",
    "vintageGallery2Image",
    "vintageGallery3Image",
    "vintageGallery4Image",

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
    "bakingFooterCopyright",

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
    "minimalEndingDescription",

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
];

formIds.forEach(
    id => {

        setFieldValue(
            id,
            ""
        );
    }
);

setFieldValue(
    "entryCategory",
    "Research"
);

setFieldValue(
    "entryDesign",
    "FilmArchiveDesign"
);

setFieldValue(
    "entryStatus",
    "Published"
);

selectedDesign =
    "FilmArchiveDesign";

hideAllDesignFields();


}

/* =========================================================
SAVE ENTRY
========================================================= */

async function saveEntry() {

if (!db) {

    alert(
        "Firebase is not ready yet."
    );

    return;
}

const saveButton =
    document.getElementById(
        "saveButton"
    );

if (saveButton) {

    saveButton.disabled =
        true;

    saveButton.textContent =
        "Saving...";
}

try {

    const editingId =
        getFieldValue(
            "editingEntryId"
        );

    const title =
        getFieldValue(
            "entryTitle"
        ).trim();

    if (!title) {

        alert(
            "Please enter a title."
        );

        return;
    }

    const category =
        getFieldValue(
            "entryCategory"
        );

    const design =
        getFieldValue(
            "entryDesign"
        ) ||
        selectedDesign;

    const description =
        getFieldValue(
            "entryDescription"
        );

    const date =
        getFieldValue(
            "entryDate"
        );

    const status =
        getFieldValue(
            "entryStatus"
        );

    const image =
        getFieldValue(
            "entryImage"
        );

    const content =
        collectDesignFields(
            design
        );

    const entryData = {

        title,

        category,

        design,

        description,

        date,

        status,

        image,

        content,

        updatedAt:
            serverTimestamp()
    };

    if (editingId) {

        const entryRef =
            doc(
                db,
                "news",
                editingId
            );

        await updateDoc(
            entryRef,
            entryData
        );

        alert(
            "Entry updated successfully."
        );

    } else {

        entryData.createdAt =
            serverTimestamp();

        const newsRef =
            collection(
                db,
                "news"
            );

        const newDocument =
            await addDoc(
                newsRef,
                entryData
            );

        console.log(
            "New entry created:",
            newDocument.id
        );

        alert(
            "New entry created successfully."
        );
    }

    closeModal();

    await loadNewsEntries();

} catch (error) {

    console.error(
        "Save error:",
        error
    );

    alert(
        "Failed to save entry.\n\n" +
        error.message
    );

} finally {

    if (saveButton) {

        saveButton.disabled =
            false;

        saveButton.textContent =
            isEditing
                ? "Update Entry"
                : "Save Entry";
    }
}

}

/* =========================================================
COLLECT DESIGN FIELDS
========================================================= */

function collectDesignFields(
designId
) {

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

        "vintageIntroTitle",
        "vintageIntroText",

        "vintageFlower1Image",
        "vintageFlower1Title",
        "vintageFlower1Text",

        "vintageFlower2Image",
        "vintageFlower2Title",
        "vintageFlower2Text",

        "vintageFlower3Image",
        "vintageFlower3Title",
        "vintageFlower3Text",

        "vintageJournalTitle",
        "vintageJournalText",

        "vintageGallery1Image",
        "vintageGallery2Image",
        "vintageGallery3Image",
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

const fieldIds =
    fieldMap[
        designId
    ] || [];

const content = {};

fieldIds.forEach(
    fieldId => {

        content[
            fieldId
        ] =
            getFieldValue(
                fieldId
            );
    }
);

return content;

}

/* =========================================================
GET FIELD VALUE
========================================================= */

function getFieldValue(
fieldId
) {

const field =
    document.getElementById(
        fieldId
    );

if (!field) {
    return "";
}

return field.value ||
    "";


}

/* =========================================================
DELETE
========================================================= */

async function deleteEntry(
entryId
) {

if (!entryId) {
    return;
}

if (!db) {

    alert(
        "Firebase is not ready yet."
    );

    return;
}

const entry =
    allEntries.find(
        item =>
            item.id ===
            entryId
    );

const title =
    entry?.title ||
    "this entry";

const confirmed =
    confirm(
        `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );

if (!confirmed) {
    return;
}

try {

    const entryRef =
        doc(
            db,
            "news",
            entryId
        );

    await deleteDoc(
        entryRef
    );

    alert(
        "Entry deleted successfully."
    );

    await loadNewsEntries();

} catch (error) {

    console.error(
        "Delete error:",
        error
    );

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

const total =
    allEntries.length;

const published =
    allEntries.filter(
        entry =>
            normalizeStatus(
                entry.status
            ) ===
            "Published"
    ).length;

const drafts =
    allEntries.filter(
        entry =>
            normalizeStatus(
                entry.status
            ) ===
            "Draft"
    ).length;

const now =
    new Date();

const currentYear =
    now.getFullYear();

const currentMonth =
    now.getMonth();

const thisMonth =
    allEntries.filter(
        entry => {

            const dateValue =
                getEntryDateValue(
                    entry
                );

            if (!dateValue) {
                return false;
            }

            const date =
                new Date(
                    dateValue
                );

            return (
                date.getFullYear() ===
                currentYear &&
                date.getMonth() ===
                currentMonth
            );
        }
    ).length;

setText(
    "totalPosts",
    total
);

setText(
    "publishedPosts",
    published
);

setText(
    "draftPosts",
    drafts
);

setText(
    "thisMonthPosts",
    String(
        thisMonth
    ).padStart(
        2,
        "0"
    )
);


}

/* =========================================================
NORMALIZE STATUS
========================================================= */

function normalizeStatus(
status
) {


if (!status) {
    return "Draft";
}

const value =
    String(
        status
    )
        .trim()
        .toLowerCase();

if (
    value ===
    "published" ||
    value ===
    "publish" ||
    value ===
    "public"
) {
    return "Published";
}

return "Draft";

}

/* =========================================================
NORMALIZE CATEGORY
========================================================= */

function normalizeCategory(
category
) {
if (!category) {
    return "Research";
}

const value =
    String(
        category
    )
        .trim()
        .toLowerCase();

const categories = {

    research:
        "Research",

    academic:
        "Academic",

    travel:
        "Travel",

    life:
        "Life"
};

return (
    categories[
        value
    ] ||
    category
);


}

/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(
value
) {

if (!value) {
    return "";
}

let date;

if (
    value &&
    typeof value.toDate ===
    "function"
) {

    date =
        value.toDate();

} else if (
    value instanceof Date
) {

    date =
        value;

} else {

    date =
        new Date(
            value
        );
}

if (
    Number.isNaN(
        date.getTime()
    )
) {

    return String(
        value
    );
}

return date.toLocaleDateString(
    "en-US",
    {
        year:
            "numeric",

        month:
            "short",

        day:
            "numeric"
    }
);


}

/* =========================================================
NORMALIZE DATE
========================================================= */

function normalizeDateForInput(
value
) {


if (!value) {
    return "";
}

let date;

if (
    value &&
    typeof value.toDate ===
    "function"
) {

    date =
        value.toDate();

} else if (
    value instanceof Date
) {

    date =
        value;

} else {

    const stringValue =
        String(
            value
        );

    if (
        /^\d{4}-\d{2}-\d{2}$/
            .test(
                stringValue
            )
    ) {

        return stringValue;
    }

    date =
        new Date(
            stringValue
        );
}

if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "";
}

const year =
    String(
        date.getFullYear()
    ).padStart(
        4,
        "0"
    );

const month =
    String(
        date.getMonth() + 1
    ).padStart(
        2,
        "0"
    );

const day =
    String(
        date.getDate()
    ).padStart(
        2,
        "0"
    );

return (
    `${year}-${month}-${day}`
);


}

/* =========================================================
DESIGN DISPLAY NAME
========================================================= */

function getDesignDisplayName(
design
) {


const names = {

    FilmArchiveDesign:
        "Film Archive",

    VintageFlowerDesign:
        "Vintage Flower",

    HomeBakingDesign:
        "Home Baking",

    MInimalPortfolio:
        "Minimal Portfolio",

    ModernMaturityDesign:
        "Modern Maturity"
};

return (
    names[
        design
    ] ||
    design ||
    "Unknown"
);


}

/* =========================================================
GET CONTENT VALUE
========================================================= */

function getContentValue(
entry,
key
) {


if (!entry) {
    return "";
}

if (
    entry.content &&
    entry.content[key] !==
    undefined
) {

    return entry.content[key];
}

if (
    entry.data &&
    entry.data[key] !==
    undefined
) {

    return entry.data[key];
}

if (
    entry[key] !==
    undefined
) {

    return entry[key];
}

return "";


}

/* =========================================================
SET TEXT
========================================================= */

function setText(
elementId,
value
) {


const element =
    document.getElementById(
        elementId
    );

if (element) {

    element.textContent =
        String(
            value
        );
}


}

/* =========================================================
TRUNCATE
========================================================= */

function truncateText(
text,
maxLength
) {


const value =
    String(
        text ||
        ""
    );

if (
    value.length <=
    maxLength
) {

    return value;
}

return (
    value.substring(
        0,
        maxLength
    ) +
    "..."
);


}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(
value
) {


if (
    value === null ||
    value === undefined
) {

    return "";
}

return String(
    value
)
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
GLOBAL FUNCTIONS
========================================================= */

window.refreshNewsAdmin =
function() {


    return loadNewsEntries();

};


window.openNewModal =
openNewModal;

window.openModal =
openModal;

window.closeModal =
closeModal;

window.selectDesign =
selectDesign;

window.handleDesignChange =
handleDesignChange;

window.editEntry =
editEntry;

window.deleteEntry =
deleteEntry;

window.saveEntry =
saveEntry;

console.log(
"News Admin JS loaded successfully."
);
