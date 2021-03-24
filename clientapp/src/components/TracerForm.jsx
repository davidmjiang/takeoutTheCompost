import React from 'react';
import pin from '../images/pin.svg';
import { PsaFields } from '../models/PsaFields';
import { searchRestaurants, searchRestaurantsByCoordinates } from '../Api/SearchRestaurants';
import { SearchResult } from './SearchResult';
import { publishReview } from '../Api/PublishReview';

/*
Props:
tracerFormCallback(fieldType, fieldValue)
onCancel()
onPublish()
location: {lat: 0, lon: 0}
*/

export class TracerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {yelpId: 0, name: "", containers: 0, cups: 0, bags: 0, utensils: 0, lat: 0, lon: 0, results:[], showResults: true};
        this.onTitleChange = this.onTitleChange.bind(this);
        this.searchRestaurants = this.searchRestaurants.bind(this);
        this.chosenSearchResult = this.chosenSearchResult.bind(this);
        this.handleContainerChange = this.handleContainerChange.bind(this);
        this.handleCupsChange = this.handleCupsChange.bind(this);
        this.handleBagsChange = this.handleBagsChange.bind(this);
        this.handleUtensilsChange = this.handleUtensilsChange.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidMount() {
        let tracerForm = document.getElementById("tracer-form");
        tracerForm.onsubmit = (ev) =>
        {
            ev.preventDefault();
        }
    }

    render() {
        let sampleDescription = "Notes";
        return (
            <form id="tracer-form">
                <div>
                    <input type="text" value={this.state.name} onChange={this.onTitleChange} placeholder="Name" className="tracer-form-title" required />
                </div>
                <button onClick={this.searchRestaurants}>Search</button>
                <div className="results">
                        {this.state.results && this.state.showResults && this.state.results.map((result) => {
                            return <SearchResult details={result} onClick={this.chosenSearchResult} />
                        })}
                </div>
                <div className="rating-buttons">
                    Containers:
                    <div className="radio">
                        <label>
                            <input type="radio" value="3" onChange={this.handleContainerChange} checked={this.state.containers == 3}/>
                            Compostable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="2" onChange={this.handleContainerChange} checked={this.state.containers == 2} />
                            Recyclable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="1" onChange={this.handleContainerChange} checked={this.state.containers == 1}/>
                            Neither
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="0" onChange={this.handleContainerChange} checked={this.state.containers == 0} />
                            N/A
                        </label>
                    </div>
                </div>
                <div className="rating-buttons">
                    Cups:
                    <div className="radio">
                        <label>
                            <input type="radio" value="3" onChange={this.handleCupsChange} checked={this.state.cups == 3}/>
                            Compostable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="2" onChange={this.handleCupsChange} checked={this.state.cups == 2} />
                            Recyclable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="1" onChange={this.handleCupsChange} checked={this.state.cups == 1}/>
                            Neither
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="0" onChange={this.handleCupsChange} checked={this.state.cups == 0} />
                            N/A
                        </label>
                    </div>
                </div>
                <div className="rating-buttons">
                    Bags:
                    <div className="radio">
                        <label>
                            <input type="radio" value="3" onChange={this.handleBagsChange} checked={this.state.bags == 3}/>
                            Compostable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="2" onChange={this.handleBagsChange} checked={this.state.bags == 2} />
                            Recyclable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="1" onChange={this.handleBagsChange} checked={this.state.bags == 1}/>
                            Neither
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="0" onChange={this.handleBagsChange} checked={this.state.bags == 0} />
                            N/A
                        </label>
                    </div>
                </div>
                <div className="rating-buttons">
                    Utensils:
                    <div className="radio">
                        <label>
                            <input type="radio" value="3" onChange={this.handleUtensilsChange} checked={this.state.utensils == 3}/>
                            Compostable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="2" onChange={this.handleUtensilsChange} checked={this.state.utensils == 2} />
                            Recyclable
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="1" onChange={this.handleUtensilsChange} checked={this.state.utensils == 1}/>
                            Neither
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="0" onChange={this.handleUtensilsChange} checked={this.state.utensils == 0} />
                            N/A
                        </label>
                    </div>
                </div>
                <div className="tracer-form-description">
                    <div>
                        <textarea value={this.state.description} onChange={this.onDescriptionChange} placeholder={sampleDescription} className="tracer-form-textbox" required />
                    </div>
                </div>
                <div className="tracer-form-buttons">
                            <button className="cancel-button" onClick={this.onCancel}>Cancel</button>
                            <button className="publish-button" onClick={this.onPublish}>Publish</button>
                </div>
            </form>
        )
    }

    handleContainerChange(event) {
        this.setState({
            containers: parseInt(event.target.value)
        });
    }

    handleUtensilsChange(event) {
        this.setState({
            utensils: parseInt(event.target.value)
        });
    }

    handleBagsChange(event) {
        this.setState({
            bags: parseInt(event.target.value)
        });
    }

    handleCupsChange(event) {
        this.setState({
            cups: parseInt(event.target.value)
        });
    }

    searchRestaurants() {
        const searchTerm = this.state.name;
        searchRestaurantsByCoordinates(searchTerm, this.props.location.lat, this.props.location.lon).then(res => {
            console.log(res);
            this.setState({results: res, showResults: true});
        });
    }

    chosenSearchResult(details) {
        this.setState({
            yelpId: details.id, 
            name: details.name, 
            lat: details.coordinates.latitude,
            lon: details.coordinates.longitude,
            showResults: false
        });
    }

    onTitleChange(ev) {
        const newTitle = ev.target.value;
        this.setState({ name: newTitle });
        this.props.changeCallback(PsaFields.TITLE, newTitle);
    }

    onCancel() {
        this.props.onCancel();
    }

    onPublish() {
        const { yelpId, name, containers, cups, bags, utensils, lat, lon } = this.state;
        const params = { yelpId, name, containers, cups, bags, utensils, lat, lon };
        publishReview(params).then((res) => {
            console.log(res);
            this.onCancel();
        });
    }
}