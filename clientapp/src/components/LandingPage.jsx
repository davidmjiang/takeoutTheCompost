import React from 'react';
import { Card } from './Card';
import { Map } from './Map';
import { CreatePSA } from './CreatePSA';
import { getAreaMatches } from '../Api/GetAreaMatches';
import { BingMap } from '../utilities/mapUtilities';
import { SignInForm } from './SignInForm';
import { isTracerView, isCardShare } from '../utilities/userRole';
import newAppIcon from '../images/contact-assist-icon.svg';
import { getSingleCard } from '../Api/GetSingleCard';
import { getAreaReviews } from '../Api/GetReviews';

export class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showingForm: false, cards: [], showingSignIn: false, signedIn: false, coordinates: {lat:0, lon:0}};
        this.showForm = this.showForm.bind(this);
        this.onFormCancel = this.onFormCancel.bind(this);
        this.onZipChange = this.onZipChange.bind(this);
        this.onSignInClick = this.onSignInClick.bind(this);
        this.onCancelSignIn = this.onCancelSignIn.bind(this);
        this.onSuccessSignIn = this.onSuccessSignIn.bind(this);
        this.searchingZip = false;
        this.onMapInit = this.onMapInit.bind(this);
    }

    render() {
        const defaultMapInfo = {
            zip: 10004,
            lat: 40.75597667,
            lon: -73.98700333,
            address: '1 Times Sq, New York, NY 10036'
        };

        let form = null;
        if (this.state.showingForm) {
            form = this.getForm();
        }

        let createPsaButton = this.getCreatePsaButton();

        return (

            <div className="landing-page-container flex-container">
                <div className="landing-page-leftpane">
                    <div className="user-profile landing-page-top">
                        <div className="app-header">
                            <img src={newAppIcon} alt={"app icon"} id="app-header-image"/>
                            <span id="app-header-title">ContactAssist</span>
                        </div>
                     </div>   
                     <div className="landing-page-location-container">
                         <input type="text" placeholder="Find location" className="landing-page-find-location" onChange={this.onZipChange}/>
                    </div>
                    <div className="landing-page-cards">
                        {this.state.cards && this.state.cards.map((card) => {
                            return this.getCard(card);
                        })}
                    </div>
                </div>
                <div className="landing-page-right-pane">
                    <div className="landing-page-filters landing-page-top">
                    {createPsaButton}
                    </div>
                    <div className="landing-page-map">
                        <Map mapInfo={defaultMapInfo} cardInfo={this.state.cards} onMapInit={this.onMapInit} />
                        {form}
                    </div>
                </div>
            </div>
        )
    }

    getForm() {
            return (
                <div className="form-container">
                    <CreatePSA onCancel={this.onFormCancel} location={this.state.coordinates}/>
                </div>
            );
    }

    getCreatePsaButton() {
            return (
                <button className="create-psa-button" onClick={this.showForm}>Create Announcement</button>
            );
    }

    showForm() {
        this.setState({showingForm: true});
    }

    onFormCancel() {
        this.setState({showingForm: false});
    }

    getCard(cardInfo) {
            return <Card open={false} cardInfo={cardInfo} /> 
    }

    onZipChange(ev) {
        let newZip = ev.target.value;
        // rudimentary zip validation so were not constantly spamming the service
        if (newZip.length >= 5 && !this.searchingZip) {
            this.searchingZip = true;
            let self = this;
            BingMap.reverseGeocoordsFromZip(newZip, (result) => {
                let params = {
                    lat: result.latitude,
                    lon: result.longitude,
                  };
                getAreaMatches(params).then(res => {
                    this.setState({ cards: res.matches });  
                }).finally(() => {
                    self.searchingZip = false;
                });
            }, () => {
                self.searchingZip = false;
            });
        }
    }

    onMapInit(location) {
        if (isCardShare()) {
            const urlParams = new URLSearchParams(window.location.search);
            const requestBody = {
                "messages": [
                    {
                        "messageId": urlParams.get("id"),
                        "messageTimestamp": urlParams.get("timestamp")
                    }
                ]
            };
            getSingleCard(requestBody).then(res => {
                this.setState({ cards: res.content.narrowcastMessages });
            }); 
        }
        else if (location) {
            let params = {
                lat: location.latitude,
                lon: location.longitude
            };
            this.setState({ coordinates: params });
            getAreaReviews().then(res => {
                this.setState({ cards: res });
            });
        }
    }

    onSignInClick() {
        this.setState({ showingSignIn: true });
    }

    onCancelSignIn() {
        this.setState({ showingSignIn: false });
    }

    onSuccessSignIn() {
        this.setState({ showingSignIn: false, signedIn: true});
    }
}