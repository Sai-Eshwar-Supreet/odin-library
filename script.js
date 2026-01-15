'use strict';

const myLibrary = {};
const bookShelf = document.querySelector('#book-shelf');

function Book(title, author, imgSrc, tags, haveRead){
    if(!new.target) {
        throw Error("Must use new operator to call the function")
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.imgSrc = imgSrc;
    this.tags = tags;
    this.haveRead = haveRead;
};

Book.prototype.toggleStatus = function(){
    this.haveRead = !this.haveRead;
    if(this.cardUI){
        this.cardUI.dataset.haveRead = this.haveRead;
    }
}

function addBookToLibrary(title, author, imgSrc, tags, haveRead){
    const book = new Book(title, author, imgSrc, tags, haveRead);

    book.cardUI = createCard(book);
    if(book.cardUI) bookShelf.prepend(book.cardUI);

    myLibrary[book.id] = book;
};

function removeBookFromLibrary(bookId){
    if(!bookId) return;
    const book = myLibrary[bookId];

    if(!book) return;

    if(book.cardUI) book.cardUI.remove();

    delete myLibrary[bookId];
}

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
    
    deleteBtn.addEventListener('click', (event) => removeBookFromLibrary(event.target.dataset.bookId));
    
    const statusBtn = createButton(undefined,'status');
    statusBtn.dataset.action = "status change";
    
    toolBar.append(deleteBtn, statusBtn);
    
    card.appendChild(toolBar);

    
    card.addEventListener('click', (event) => {
        const bookID = event.currentTarget.dataset.bookId;
        switch(event.target.dataset.action){
            case "delete":
                if(confirm(`Are you sure you want to delete "${myLibrary[bookID].title}"`)){
                    removeBookFromLibrary(bookID);
                }
                break;
            case "status change":
                myLibrary[bookID].toggleStatus();
                break;
        }
    });

    return card;
}



const addBookForm = document.querySelector('#add-book');
const modal = document.querySelector('#entry-modal')
const openEntryModal = document.querySelector('#open-entry');
const closeEntryModal = document.querySelector('#close-entry');

function openModal(){
    modal.showModal();
}

function submitForm(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const author = formData.get("author");
    const imgSrc = formData.get("thumbnail");
    const tags = formData.get("tags").trim().split(",");

    addBookToLibrary(title, author, imgSrc, tags, false);

    closeModal();
}

function closeModal() {
    modal.close();
    addBookForm.reset();
}

openEntryModal.addEventListener('click', openModal)
closeEntryModal.addEventListener('click', closeModal)

addBookForm.addEventListener('submit', submitForm)




// Default

addBookToLibrary("DSA Made Easy", "Narasimha Karumanchi", "https://m.media-amazon.com/images/I/714+tgyHDRL._SY385_.jpg", ["DSA", "Algorithms", "Data structures", "Programming"], true);
addBookToLibrary("Atomic Habits", "James Clear", "https://m.media-amazon.com/images/I/51b4CfdTSDL._SY445_SX342_FMwebp_.jpg", ["Habits", "Self-help"], false);
addBookToLibrary("So Good They Can't Ignore You", "Cal Newport", "https://m.media-amazon.com/images/I/71KLTWMGdrL._SY466_.jpg", ["Work", "Self-help", "Value", "Career"], false);