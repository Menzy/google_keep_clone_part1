class App {

    /**
     * Represents the constructor function of the app.
     * Initializes the app by setting up references to various elements and attaching event listeners.
     */

    constructor() {
        // Get references to the form, note title, and form buttons
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = '';
        this.text = '';
        this.id = '';

        this.$placeholder = document.querySelector('#placeholder');
        this.$form = document.querySelector('#form');
        this.$notes = document.querySelector('#notes');
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text');
        this.$formButtons = document.querySelector('#form-buttons');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$modal = document.querySelector('.modal');
        this.$modalTitle = document.querySelector('.modal-title');
        this.$modalText = document.querySelector('.modal-text');
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorTooltip = document.querySelector('#color-tooltip');

        // Call the addEventListeners method to attach event listeners
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        // Attach a click event listener to the entire document body
        document.body.addEventListener('click', event => {
            // Call the handleFormClick method when a click event occurs
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);

        });
        // Attach a mouseover event listener to call the tooltip when a mouseover event occurs
        document.body.addEventListener('mouseover', event => {
            // Call the openTooltip method when a mouseover event occurs
            this.openTooltip(event);
        });

        // Attach a mouseout event listener to close the tooltip when a mouseout event occurs
        document.body.addEventListener('mouseout', event => {
            this.closeTooltip(event);
        });

        // Attach a mouseover event listener to the color tooltip element
        this.$colorTooltip.addEventListener('mouseover', function () {
            this.style.display = 'flex';
        });

        // Attach a mouseout event listener to the color tooltip element
        this.$colorTooltip.addEventListener('mouseout', function () {
            this.style.display = 'none';
        });

        // Attach a click event listener to the color tooltip element
        this.$colorTooltip.addEventListener("click", event => {
            const color = event.target.dataset.color;
            if (color) {
                this.editNoteColor(color);
            }
        });

        // Attach a submit event listener to the form element
        this.$form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            if (hasNote) {
                // Add the note to the list
                this.addNote({ title, text });
            }
        });

        // Attach a click event listener to the close button
        this.$formCloseButton.addEventListener('click', event => {
            // Call the closeForm method when the close button is clicked
            event.stopPropagation();
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);
        });


    }


    handleFormClick(event) {
        // Check if the clicked element is inside the form
        const isFormClicked = this.$form.contains(event.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text

        if (isFormClicked) {
            // If the clicked element is inside the form, open the form
            this.openForm();
        } else if (hasNote) {
            // If the form is open and the clicked element is outside the form, add the note
            this.addNote({ title, text });
        } else {
            // If the clicked element is outside the form, close the form
            this.closeForm();
        }
    }


    openForm() {
        // Add the 'form-open' class to the form element
        this.$form.classList.add('form-open');
        // Display the note title and form buttons
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {
        // Remove the 'form-open' class from the form element
        this.$form.classList.remove('form-open');
        // Hide the note title and form buttons
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        // Reset the note title and text values
        this.$noteTitle.value = '';
        this.$noteText.value = '';

    }


    // Handles the opening of the modal when a note is clicked.
    openModal(event) {

        if (event.target.matches('.toolbar-delete')) return;

        if (event.target.closest('.note')) {
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }
    // Handles the closing of the modal.
    closeModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(event) {
        const target = event.target.closest('.toolbar-color');
        if (!target) return;

        this.id = target.dataset.id;

        // Get the position of the toolbar icon relative to the viewport
        const toolbarCoords = target.getBoundingClientRect();
        const horizontal = toolbarCoords.left + window.scrollX;
        const vertical = toolbarCoords.bottom + window.scrollY;

        // Calculate the position of the tooltip relative to the viewport
        // based on the position of the toolbar icon
        this.$colorTooltip.style.left = horizontal + 'px';
        this.$colorTooltip.style.top = vertical + 'px';
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event) {
        // Find the closest ancestor with the class 'toolbar-color'
        const target = event.target.closest('.toolbar-color');
        // If no ancestor with the class 'toolbar-color' is found, return
        if (!target) return;

        // Hide the tooltip
        this.$colorTooltip.style.display = 'none';
    }


    addNote({ title, text }) {
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
        };

        this.notes = [...this.notes, newNote];
        // console.log(this.notes);
        this.render();
        this.closeForm();
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, title, text } : note
        );
        this.render();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, color } : note
        );
        this.render();
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if (!$selectedNote) return;

        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title = $noteTitle.innerText
        this.text = $noteText.innerText
        this.id = $selectedNote.dataset.id
    }

    // Handle the deletion of a note when the delete button is clicked
    deleteNote(event) {
        // Stop the event from propagating to parent elements
        event.stopPropagation();
        // Check if the clicked element is the delete button
        if (!event.target.matches('.toolbar-delete')) return;

        // Find the closest note element to the clicked delete button
        const $selectedNote = event.target.closest('.note');
        // If no note element is found, return
        if (!$selectedNote) return;

        // Get the id of the selected note
        const id = $selectedNote.dataset.id;
        // Remove the note from the notes array by filtering out the note with the matching id
        this.notes = this.notes.filter(note => note.id !== Number(id));
        // Update the displayed notes and save them to local storage
        this.render();
    }


    // Renders the app by saving the notes and displaying them.
    render() {
        this.saveNotes();
        this.displayNotes();
    }


    // Saves the notes to the local storage.
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }


    // Displays the notes on the page.
    displayNotes() {
        // Check if there are any notes
        const hasNotes = this.notes.length > 0;
        // Show or hide the placeholder based on the presence of notes
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        // Generate the HTML for each note and insert it into the notes container
        this.$notes.innerHTML = this.notes.map(note => `
                <div style="background: ${note.color};" class="note" data-id="${note.id}" >
                    <div class="${note.title && 'note-title'}">${note.title}</div>
                    <div class="note-text">${note.text}</div>
                    <div class="toolbar-container">
                        <div class="toolbar">
                            <i class="fa-solid fa-palette toolbar-color" data-id=${note.id}></i>
                            <i class="fa-solid fa-trash toolbar-delete"></i>    
                        </div>
                    </div>
                </div>
            `).join("");
    }
}

// Create a new instance of the App class
new App();