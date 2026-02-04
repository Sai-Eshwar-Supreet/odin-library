'use strict';
const bookShelf = document.querySelector('#book-shelf');

class Book{
    constructor(title, author, imgSrc, tags, haveRead){
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.imgSrc = imgSrc;
        this.tags = tags;
        this.haveRead = haveRead;
    }
    
    toggleStatus(){
        this.haveRead = !this.haveRead;
    }
}

const library = (
    function(){
        const books = [];
        function addBookToLibrary(title, author, imgSrc, tags, haveRead){
            const book = new Book(title, author, imgSrc, tags, haveRead);
            books.push(book);
        };

        function removeBookFromLibrary(bookId){
            if(!bookId) return;

            const index = books.findIndex(el => (el.id === bookId));
            if(index !== -1) books.splice(index, 1);
        }
        return {
            books,
            addBookToLibrary,
            removeBookFromLibrary
        }
    }
)();


function createDiv(...classList){
    const div = document.createElement('div');
    div.classList = classList;
    return div;
}

function createImg(src, alt){
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    return img
}

function createHeader(level, text, ...classList){
    if(!Number.isInteger(level) || level <= 0 || level > 6) return;
    const header = document.createElement(`h${level}`);
    header.textContent = text; 
    header.classList = classList;

    return header;
}

function createPara(text, ...classList){
    const para = document.createElement('p');
    para.textContent = text;
    para.classList = classList;

    return para;
}

function createButton(content, ...classList){
    const button = document.createElement('button');
    if(content) button.appendChild(content);
    button.classList = classList;

    return button;
}

function createAnchor(content, href, ...classList){
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.appendChild(content);
    anchor.classList = classList;
    return anchor;
}

function createTrashIcon(size = 24){

    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(xmlns, 'svg');
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute('viewBox', "0 0 24 24");
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('fill', 'currentColor');

    const path1 = document.createElementNS(xmlns, "path");
    path1.setAttribute("d", "M6 7h12l-1 14H7L6 7z");

    const path2 = document.createElementNS(xmlns, "path");
    path2.setAttribute("d", "M9 4h6l1 2H8l1-2z");

    svg.append(path1, path2);

    return svg;
}

function createCard(book){
    if(!(book instanceof Book)) return undefined;

    const card = createDiv("card");

    card.dataset.haveRead = book.haveRead;
    card.dataset.bookId = book.id;

    // Thumbnail
    
    if(book.imgSrc){
        const thumbnail = createDiv('thumbnail');
        const img = createImg(book.imgSrc, `Image of the book - ${book.title}`)
        thumbnail.appendChild(img);
        card.appendChild(thumbnail);
    }
    
    // Title
    const title = createHeader(3, book.title, 'title');
    card.appendChild(title);
    
    // Author
    const author = createPara(book.author, 'author');
    card.appendChild(author);
    
    // Tags
    
    if(Array.isArray(book.tags) && book.tags.length > 0){
        const tagContainer = createDiv('tag-container');
        for(let tag of book.tags){
            const validTag = tag.trim();
            if(validTag.length <= 0) continue;
            const tagUI = createPara(validTag, 'tag');
            tagUI.title = validTag;
            tagContainer.appendChild(tagUI);
        }

        card.appendChild(tagContainer);
    }
    
    // Tool bar
    const toolBar = createDiv('tool-bar');
    
    const svg = createTrashIcon();
    const deleteBtn = createButton(svg, 'delete');
    deleteBtn.dataset.action = "delete";
    
    const statusBtn = createButton(undefined,'status');
    statusBtn.dataset.action = "status change";
    
    toolBar.append(deleteBtn, statusBtn);
    
    card.appendChild(toolBar);

    
    card.addEventListener('click', onCardUpdate);

    return card;
}

function onCardUpdate(event) {
    const bookID = event.currentTarget.dataset.bookId;
    const book = library.books.find(el => (el.id === bookID));

    if (!book) return;

    switch (event.target.dataset.action) {
        case "delete":
            if (confirm(`Are you sure you want to delete "${book.title}"`)) {
                library.removeBookFromLibrary(bookID);
                renderLibrary();
            }
            break;
        case "status change":
            book.toggleStatus();
            renderLibrary();
            break;
    }
}

function renderLibrary(){
    bookShelf.innerHTML = '';

    for(let book of library.books){
        const cardUI = createCard(book);
        if(cardUI) bookShelf.prepend(cardUI);
    }
}


const addBookForm = document.querySelector('#add-book');
const modal = document.querySelector('#entry-modal')
const openEntryModal = document.querySelector('#open-entry');
const closeEntryModal = document.querySelector('#close-entry');

// Form Validation

const titleInput = addBookForm.querySelector('#book-title');
const authorInput = addBookForm.querySelector('#book-author');
const thumbnailInput = addBookForm.querySelector('#book-thumbnail');
const tagsInput = addBookForm.querySelector('#book-tags');

const tagRegExp = new RegExp(/^([0-9a-zA-Z\s]+(,\s*)?)*$/);

const inputConstraintList = {};

function createCustomMessage(name, input, {customError="", patternMismatch = "", valueMissing = "", rangeUnderflow = "", rangeOverflow = "", stepMismatch = "", tooLong = "", tooShort = "", typeMismatch = ""}){
    return {
        [name] : {
            input,
            customError,
            patternMismatch,
            valueMissing,
            rangeUnderflow,
            rangeOverflow,
            stepMismatch,
            tooLong,
            tooShort,
            typeMismatch
        }
    }
}

Object.assign(inputConstraintList, createCustomMessage("title", titleInput, {valueMissing: "Please enter the book title.", patternMismatch: "Please enter a valid title."}));
Object.assign(inputConstraintList, createCustomMessage("author", authorInput, {valueMissing: "Please enter the book author."}));
Object.assign(inputConstraintList, createCustomMessage("thumbnail", thumbnailInput, {typeMismatch: "Please enter a valid URL."}));
Object.assign(inputConstraintList, createCustomMessage("tags", tagsInput, {customError: "Please enter valid tags. Only comma separated alphanumeric characters are allowed."}));

function openModal(){
    modal.showModal();
}

function validateInput(name, customError = false){
    const inputConstraint = inputConstraintList[name];
    if(!inputConstraint) return;
    
    const input = inputConstraint.input;

    input.setCustomValidity(customError ? "Custom Error" : "");

    if(input.validity.valid){
        return true;
    }

    for(let error in input.validity){
        if(input.validity[error]){
            input.setCustomValidity(inputConstraint[error]);
            input.reportValidity();
            return false;
        }
    }

    return true;
}

function submitForm(event){
    event.preventDefault();

    tagsInput.setCustomValidity("");

    const isValid = validateInput("title") && validateInput("author") && validateInput("thumbnail") && validateInput("tags", !tagRegExp.test(tagsInput.value));
    if(!isValid) return;
    
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const author = formData.get("author");
    const imgSrc = formData.get("thumbnail");
    const tags = formData.get("tags").trim().split(",");

    closeModal();
    
    library.addBookToLibrary(title, author, imgSrc, tags, false);
    
    renderLibrary();
}

function closeModal() {
    modal.close();
    addBookForm.reset();
}

openEntryModal.addEventListener('click', openModal);
closeEntryModal.addEventListener('click', closeModal);

addBookForm.addEventListener('submit', submitForm);

// Default


library.addBookToLibrary("DSA Made Easy", "Narasimha Karumanchi", "https://m.media-amazon.com/images/I/714+tgyHDRL._SY385_.jpg", ["DSA", "Algorithms", "Data structures", "Programming"], false);
library.addBookToLibrary("Atomic Habits", "James Clear", "https://m.media-amazon.com/images/I/51b4CfdTSDL._SY445_SX342_FMwebp_.jpg", ["Habits", "Self-help"], false);
library.addBookToLibrary("So Good They Can't Ignore You", "Cal Newport", "https://m.media-amazon.com/images/I/71KLTWMGdrL._SY466_.jpg", ["Work", "Self-help", "Value", "Career"], false);


renderLibrary();