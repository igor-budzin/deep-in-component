var Note = React.createClass({
    render: function() {
        return (
            <div className={"note " + this.props.color}>
            	<span className="delete-note" onClick={this.props.onDelete}>x</span>
            	{this.props.children}
            </div>
        );
    }
});

var NoteSearch = React.createClass({

    render: function() {
        return (
            <input type="text" className="note-search" placeholder="Search note ..." />
        )
    }

});

var NotesGrid = React.createClass({

    componentDidUpdate: function(prevProps) {
        if(this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    componentDidMount: function() {

        var elem = this.refs.grid;
        this.msnry = new Masonry( elem, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10
        });
    },

    render: function() {
    	var onNoteDelete = this.props.onNoteDelete;

        return (
                <div className="notes-grid" ref="grid">
                    {
                        this.props.notes.map(function(note) {
                            return <Note key={note.id} color={note.color} onDelete={onNoteDelete.bind(null, note)}>{note.text}</Note>
                        })
                        
                    }
                </div>
        );
    }
});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            color: ["red", "green", "yellow", "blue", "purple"],
            pickedColor: "green"
        }
    },

    handlerTextChange: function(event) {
        this.setState({ text: event.target.value });
    },

    handlerNoteAdd: function() {
    	if(this.state.text.length !== 0) {
    		var newNote = {
    		    text: this.state.text,
    		    color: this.state.pickedColor,
    		    id: Date.now()
    		};
    		this.props.onNoteAdd(newNote);
    		this.setState({ text: '' });
    	}
    },

    componentDidUpdate: function() {
        for(var i = 0; i < document.getElementsByClassName('color').length; i++) {
            if(document.getElementsByClassName('color')[i].classList.contains(this.state.pickedColor)) {
                document.getElementsByClassName('color')[i].classList.add('active');
            }
            else {
                document.getElementsByClassName('color')[i].classList.remove('active');   
            }
        }
    },

    colorPick: function(color, colorId) {
        this.setState({ pickedColor: color });
    },

    render: function() {
        var colorPick = this.colorPick;
        return (
                <div className="note-editor">
                    <textarea rows="5" className="textarea" value={this.state.text} placeholder="Enter yours text here ..." onChange={this.handlerTextChange} />
                    <div>
                        <div className="color-picker">
                            {
                                this.state.color.map(function(el, i) {
                                   return <ColorElement color={el} key={i} colorPick={colorPick} />
                                })
                            }
                        </div>
                        <button className="add-button" onClick={this.handlerNoteAdd}>Add</button>
                    </div>
                </div>
        )
    }
});

var ColorElement = React.createClass({
    colorPicker: function() {
        this.props.colorPick(this.props.color);
    },

    render: function() {
        return (
                <span className={"color " + this.props.color} onClick={this.colorPicker}></span>
        )
    }
});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: [],
            displayedNotes: []
        }
    },

    componentWillMount: function() {
    	var localNotes = JSON.parse(localStorage.getItem('notes'));
    	if(localNotes) {
    		this.setState({
    			notes: localNotes,
                displayedNotes: localNotes
    		});
    	}
    },

    componentDidUpdate: function() {
    	this.updateLocalStorage();
    },

    handlerNoteDelete: function(note) {
    	var noteId = note.id;
    	var newNotes = this.state.notes.filter(function(note) {
    		return note.id !== noteId;
    	});
    	this.setState({ 
            notes: newNotes,
            displayedNotes: newNotes
        });
    },
 
    handlerNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({
            notes: newNotes,
            displayedNotes: newNotes
        });
    },

    handlerSearch: function(event) {
        var searchQuery = event.target.value.toLowerCase();
        var displayedNotes = this.state.notes.filter(function(el) {
            var searchValue = el.text.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            displayedNotes: displayedNotes
        });
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <input type="text" className="note-search" onChange={this.handlerSearch} placeholder="Search notes ..." />
                <NoteEditor onNoteAdd={this.handlerNoteAdd} />
                <NotesGrid notes={this.state.displayedNotes} onNoteDelete={this.handlerNoteDelete} />
            </div>
        )
    },

    updateLocalStorage: function() {
    	var notes = JSON.stringify(this.state.notes);
    	localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById("mount-point")
);