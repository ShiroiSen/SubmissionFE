const books = [];
const RENDER_EVENT = "render_book";
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded',function(){
    const inputForm = document.getElementById('inputBook');
    inputForm.addEventListener('submit',function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT,function(){
    const inCompletedBook = document.getElementById('incompleteBookshelfList');
    inCompletedBook.innerHTML = '';

    const completedBook =  document.getElementById('completeBookshelfList');
    completedBook.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (!bookItem.isComplete){
            inCompletedBook.append(bookElement);
        } else {
            completedBook.append(bookElement);
            
        }
    }
});

function addBook(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = parseInt(document.getElementById('inputBookYear').value);
    const bookId = generateBookId();
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const bookObject = generateBookObject(bookId,bookTitle,bookAuthor,bookYear,bookIsComplete);

    books.push(bookObject);
    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function generateBookId() {
    return +new Date();
};

function generateBookObject(id,title,author,year,isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    };
};

function makeBook(bookObject){
    const judulBuku = document.createElement('h3');
    judulBuku.innerText = bookObject.title;

    const penulisBuku = document.createElement('p');
    penulisBuku.innerText = `Penulis : ${bookObject.author}`;

    const tahunBuku = document.createElement('p');
    tahunBuku.innerText = `Tahun : ${bookObject.year}`;

    const infoContainer = document.createElement('article');
    infoContainer.classList.add('book_item','card_list');
    infoContainer.append(judulBuku,penulisBuku,tahunBuku);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book_list');
    bookContainer.append(infoContainer);
    bookContainer.setAttribute('id',`book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('trash-button');
        deleteButton.addEventListener('click',function(){
            deleteBookFromCompleted(bookObject.id);
        })

        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click',function(){
            undoBookFromCompleted(bookObject.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.addEventListener('click',function(){
            editBook(bookObject.id);
        })
        
        buttonContainer.append(undoButton,editButton,deleteButton);
        infoContainer.append(buttonContainer);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('done-button');
        checkButton.addEventListener('click',function(){
            addBooktoCompleted(bookObject.id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('trash-button');
        deleteButton.addEventListener('click',function(){
            deleteBookFromCompleted(bookObject.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.addEventListener('click',function(){
            editBook(bookObject.id);
        })

        buttonContainer.append(checkButton,editButton,deleteButton);
        infoContainer.append(buttonContainer);
    }
    return bookContainer;
};

const searchInput = document.getElementById('searchBookTitle');
searchInput.addEventListener('keyup',function(event){
    setTimeout(()=>{
        const inCompletedBook = document.getElementById('incompleteBookshelfList');
        inCompletedBook.innerHTML = '';
        const completedBook =  document.getElementById('completeBookshelfList');
        completedBook.innerHTML = '';

        const searchInputValue = searchInput.value.toLowerCase();
        for (const bookItem of books) {
            if(bookItem.title.toLowerCase().includes(searchInputValue)){
                const list = makeBook(bookItem);
                if(!bookItem.isComplete){
                    inCompletedBook.append(list);
                } else {
                    completedBook.append(list);
                }
            }
        }
    },500)
})

document.getElementById('searchBook').addEventListener('submit',function(event){
    event.preventDefault();
})

function editBook(bookId){
    const bookTarget = findBook(bookId);
    const bookIndex = findBookIndex(bookId);
    if (bookTarget == null) return;

    const bookTitle = document.getElementById('inputBookTitle');
    const bookAuthor = document.getElementById('inputBookAuthor');
    const bookYear = document.getElementById('inputBookYear');
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
   
    bookTitle.value = bookTarget.title;
    bookAuthor.value = bookTarget.author;
    bookYear.value = bookTarget.year;

    if(bookTarget.isComplete){
        bookIsComplete.value = true;
    }else {
        bookIsComplete.value = false;
    }

    books.splice(bookIndex,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBooktoCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 };

 function findBook(bookId){
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
 };

 function deleteBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;
    books.splice(bookTarget,1)

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 };

 function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    
 };

 function findBookIndex(bookId) {
    for (const index in books){
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
 };

 function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY,parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
 };

 function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Update browsernya ya kak');
        return false;
    }
    return true;
 };

 function showToast(message) {
    const toast = document.getElementById('toast');
    toast.className = 'toast show';
    toast.innerText = message;
    setTimeout(function() {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }

 document.addEventListener(SAVED_EVENT, function() {
  showToast('Data telah diperbarui');
});

 function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
 };
