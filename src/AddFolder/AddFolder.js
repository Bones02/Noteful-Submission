import React from 'react';
import config from '../config';

//Imported Apicontext
import ApiContext from '../ApiContext'


class AddFolder extends React.Component {
    /**
     * Just so you know there is an easier way to set up props and state
     * the constructor is not needed anymore but you can still use it if you want to
     */
    
     //NEW WAY OF USING STATE. PROPS ARE AUTOMATICALLY IMPORTED
    state = {
        name: {
            value: '',
            touched: false
        }
    }

    // OLD WAY OF SETTING UP PROPS AND STATE
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       name: {
    //         value: '',
    //         touched: false
    //       }
    //     }
    // } 


    //Initialized ApiContext
    static contextType = ApiContext;

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {name} = this.state;
    
        console.log(name);
        let options = {
            method: 'POST', 
            body: JSON.stringify({name: name.value }),
            headers: { 'Content-Type': 'application/json'}
        }
        fetch(`${config.API_ENDPOINT}/folders`, options) 
            .then(res => res.json())
            .then(() => {

            /**
             * You can't just pass in name. You have to pass in and object
             * with name: value
             */
            // this.context.addFolder(name)

            this.context.addFolder({name: name.value})
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

    render() {
        
        return (
            <form className="registration" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Folder</h2>
                <div className="addfolder__hint">* required field</div>  
                <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input type="text" className="name__control"
                    name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                {this.state.name.touched}
                </div>
    
                <div className="addfolder__button__group">
                <button type="reset" className="addfolder__button">
                    Cancel
                </button>
                <button type="submit" className="addfolder__button" disabled={this.validateName()}>
                    Save
                </button>
                </div>
            </form>
        )
    }
}


export default AddFolder;