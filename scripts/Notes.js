export default class Notes {
    constructor() {
        this.showAllNotes();//add it only on load
        this.clearTextAreaOfNote();
        this.saveNote();
        this.deleteNote();
        this.updateNote();
    }

    addNewNote(title, note){
        let messageData = {
            title: title,
            note: note,
        };
        let newMessageKey = firebase.database().ref('notes/').push().key;
        let newUpdate = {};
        newUpdate[newMessageKey] = messageData;

        return firebase.database().ref('notes/').update(newUpdate);
    }

    showAllNotes() {
        let noteRef = firebase.database().ref('notes/');
        const that = this;///????

        noteRef.on('value', function (data){

            data.forEach(function (data) {
                const arrayOfIds = Array.from(document.getElementsByClassName("note-form-container")).map(el => el.id);

                if (arrayOfIds.includes(data.key) == false) {


                    let note = data.val();

                    let notes = document.getElementById('flex-container-all-notes');

                    let newNote = document.createElement('div');
                    newNote.setAttribute("id", data.key);
                    newNote.setAttribute('class', 'note-form-container');
                    notes.appendChild(newNote);

                    let text = document.createElement('div');
                    text.setAttribute('class', 'flex-container-content');
                    newNote.appendChild(text);

                    let title = document.createElement('p');
                    title.textContent = 'Title';
                    text.appendChild(title);


                    let titleContent = that.addAttribute('title', '1', '20', data.key);
                    titleContent.textContent = note.title;
                    text.appendChild(titleContent);

                    let content = document.createElement('p');
                    content.textContent = 'Some information';
                    text.appendChild(content);

                    let noteContent = that.addAttribute('note', '8', '20', data.key);
                    noteContent.textContent = note.note;
                    text.appendChild(noteContent);

                    let buttonContainer = document.createElement('div');
                    buttonContainer.setAttribute('class', 'flex-container-buttons');
                    newNote.appendChild(buttonContainer);

                    let buttonDelete = document.createElement('button');
                    buttonDelete.setAttribute('data-del', data.key);
                    buttonDelete.textContent = 'Delete';
                    buttonContainer.appendChild(buttonDelete);
                }
            });

        }.bind(this));
    }

    addAttribute(textareaClass, numberOfRows, numberOfColumns, key) {
        let noteContent = document.createElement('textarea');
        noteContent.setAttribute('class', textareaClass);
        noteContent.setAttribute('rows', numberOfRows);
        noteContent.setAttribute('cols', numberOfColumns);
        noteContent.setAttribute('data-id', key);
        return noteContent;
    }

    clearTextAreaOfNote() {
        document.getElementById('clear').addEventListener('click', function() {
            document.getElementById('title').value = '';
            document.getElementById('note-content').value = '';
        });
    }

    saveNote() {
        const that = this;//It's for that.addNewNote(inputTitle, inputNote);
        document.getElementById('save').addEventListener('click', function() {
            let inputTitle = document.getElementById('title').value;
            let inputNote = document.getElementById('note-content').value;
            if(inputTitle.trim().length && inputNote.trim().length) {
                //this.addNewNote(inputTitle, inputNote);//It doesn't work!!!!
                // Notes.addNewNote(inputTitle, inputNote);// if method addNewNote is static
                that.addNewNote(inputTitle, inputNote);//ask about it!!!!
                document.getElementById('title').value = '';
                document.getElementById('note-content').value = '';
            }
        });
    }


    deleteNote() {
        document.addEventListener('click', function(event){
            let id = event.target.dataset.del;
            firebase.database().ref('notes/' + id).remove();
            document.getElementById(id).remove();
            event.stopPropagation();//Прекращает дальнейшую передачу текущего события
        });
    }

    updateNote() {
        document.addEventListener('keyup', function(event){
            let id = event.target.dataset.id;
            console.log(id);

            let titleContent = document.querySelector('#' + id + ' .title').value;

            let noteContent =  document.querySelector('#' + id + ' .note').value;

            firebase.database().ref('notes/').child(id).set({'title':  titleContent, 'note': noteContent});
            event.stopPropagation();
        });
    }

}

