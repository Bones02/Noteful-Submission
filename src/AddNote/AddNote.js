import React from 'react';
import { Link } from 'react-router-dom'
import ValidationError from '../AddNote/ValidationError';
import config from '../config';
import NoteError from '../NoteError';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';

class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          },
          content: '',
          folderId: ''
        }
    } 
    static contextType = ApiContext

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    updateContent(content) {
        this.setState({content: content });
    }

    handleDropdownClick(folderId) { 
        this.setState({folderid: folderId});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {name, folderId, content} = this.state;

        let options = {
            method: 'POST', 
            // You were missing modified for the date. I added it.
            body: JSON.stringify({
                name: name.value, 
                folderId, 
                content,
                modified: new Date()
            }),
            headers: { 'Content-Type': 'application/json'}
        }
        fetch(`${config.API_ENDPOINT}/note`, options) 
            .then(res => res.json())
            .then((result) => {

            //Changed the history to just use regular props
            //Also added addNote from context

            // this.props.routeProps.history.push('/')
            this.context.addNote({name: name.value, folderid: folderId, content})
            this.props.history.push('/')
            })
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
          return "Name is required";
        } else if (name.length < 3) {
          return "Name must be at least 3 characters long";
        }
    }

    validateFolder() {
        const folder = this.state.folderID.trim();
        if (folder.length === 0) {
          return "Folder is required";
        }
    }

    render() { 
        const {folders} = this.props
        const dropdownItems = folders.map((item, index) => { 
            return <option key={item.id} value={item.id}>{item.name}</option>
        })
        
    

        return (
            <form className="addnote" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Note</h2>
                <div className="addnote__hint">* required field</div>
                <div className="form-group">
                    <label htmlFor="name">Name{' '}
                    <input type="text" className="name__control" required
                        name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                    </label><br />

                    <label htmlFor="content">Add Text{' '}
                    <input type="text" className="name__control" required
                        name="content" id="content" onChange={e => this.updateContent(e.target.value)}/>
                    </label><br />

                    <label htmlFor="folder">Select Folder{' '}
                    <select onChange={e => this.handleDropdownClick(e.target.value)}>
                        {dropdownItems} 
                    </select>
                    </label>
                </div>
    
                <div className="addfolder__button__group">
                <button 
                    tag={Link}
                    to='/'
                    type="reset" 
                    className="addnote__button">
                    Cancel
                </button>
                <NoteError>
                    <button 
                        tag={Link}
                        to='/'
                        type="submit" 
                        className="addnote__button"
                        disabled={this.validateName()}>
                        Save
                    </button>
                </NoteError>
                </div>
            </form>
        )
    }
}

AddNote.propTypes = {
    name: PropTypes.string,
    content: PropTypes.string,
    folderid: PropTypes.number,
};

export default AddNote;