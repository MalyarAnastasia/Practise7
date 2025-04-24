console.log("app.js loaded"); 

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired"); 
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker зарегистрирован:', registration.scope);
        } catch (err) {
          console.error('Ошибка регистрации:', err);
        }
      });
    }
  
    const noteInput = document.getElementById('noteInput');
    const addButton = document.getElementById('addButton');
    const notesList = document.getElementById('notesList');
    const offlineIndicator = document.getElementById('offlineIndicator');
  
    const noteModal = document.getElementById('noteModal');
    const modalNoteText = document.getElementById('modalNoteText');
    const saveModalButton = document.getElementById('saveModalButton');
    const closeModalButton = document.querySelector('.close');
  
    let currentNoteIndex = -1; 
  
    function saveNotes(notes) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  
    function loadNotes() {
      const notes = localStorage.getItem('notes');
      return notes ? JSON.parse(notes) : [];
    }
  
    function renderNotes(notes) {
      notesList.innerHTML = '';
  
      notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note;
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation(); 
          deleteNote(index);
        });
  
        li.appendChild(deleteButton);
        notesList.appendChild(li);
  
        li.addEventListener('click', () => {
          openNoteModal(index);
        });
      });
    }
  
    function addNote() {
      const noteText = noteInput.value.trim();
      if (noteText !== '') {
        const notes = loadNotes();
        notes.push(noteText);
        saveNotes(notes);
        renderNotes(notes);
        noteInput.value = '';
      }
    }
  
    function deleteNote(index) {
      const notes = loadNotes();
      notes.splice(index, 1);
      saveNotes(notes);
      renderNotes(notes);
    }
  
    function openNoteModal(index) {
      currentNoteIndex = index;
      modalNoteText.value = loadNotes()[index];
      noteModal.style.display = "block";
    }
  
    function closeNoteModal() {
      noteModal.style.display = "none";
      currentNoteIndex = -1;
    }

    saveModalButton.addEventListener('click', () => {
      const notes = loadNotes();
      notes[currentNoteIndex] = modalNoteText.value;
      saveNotes(notes);
      renderNotes(notes);
      closeNoteModal();
    });
  
    closeModalButton.addEventListener('click', closeNoteModal);

    addButton.addEventListener('click', addNote);
  
    renderNotes(loadNotes());
  
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  
    function updateOnlineStatus() {
      if (navigator.onLine) {
        offlineIndicator.classList.remove('visible');
      } else {
        offlineIndicator.classList.add('visible');
      }
    }
  
    updateOnlineStatus();
  });