const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// Show an element
// const show = (elem) => {
//   elem.style.display = 'inline';
// };

// Hide an element
// const hide = (elem) => {
//   elem.style.display = 'none';
// };

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

var getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  })
};

var saveNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  })
};

var deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  })
};

var renderActiveNote = function () {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr('readonly', true);
    $noteText.attr('readonly', true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

var handleNoteSave = () => {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };
  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
var handleNoteDelete = function (event) {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
var handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

var handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render the list of note titles
var renderNoteList = async (notes) => {
  $noteList.empty();

  let noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");
    $li.append($span, $delBtn);
    noteListItems.push($li); 
  }
 

  $noteList.append(noteListItems);
 };
//   // Returns HTML element with or without a delete button
//   const createLi = (text, delBtn = true) => {
//     const liEl = document.createElement('li');
//     liEl.classList.add('list-group-item');

//     const spanEl = document.createElement('span');
//     spanEl.classList.add('list-item-title');
//     spanEl.innerText = text;
//     spanEl.addEventListener('click', handleNoteView);

//     liEl.append(spanEl);

//     if (delBtn) {
//       const delBtnEl = document.createElement('i');
//       delBtnEl.classList.add(
//         'fas',
//         'fa-trash-alt',
//         'float-right',
//         'text-danger',
//         'delete-note'
//       );
//       delBtnEl.addEventListener('click', handleNoteDelete);

//       liEl.append(delBtnEl);
//     }

//     return liEl;
//   };

//   if (jsonNotes.length === 0) {
//     noteListItems.push(createLi('No saved Notes', false));
//   }

//   jsonNotes.forEach((note) => {
//     const li = createLi(note.title);
//     li.dataset.note = JSON.stringify(note);

//     noteListItems.push(li);
//   });

//   if (window.location.pathname === '/notes') {
//     noteListItems.forEach((note) => noteList[0].append(note));
//   }
// };

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = () => {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

  $saveNoteBtn.on('click', handleNoteSave);
  $newNoteBtn.on('click', handleNewNoteView);
  $noteTitle.on('keyup', handleRenderSaveBtn);
  $noteText.on('keyup', handleRenderSaveBtn);

getAndRenderNotes();