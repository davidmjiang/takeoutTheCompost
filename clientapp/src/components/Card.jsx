import React from 'react';
import chevron from '../images/chevron.svg';
import calendar from '../images/calendar.svg';
import bell from "../images/bell.svg";
import shareIcon from "../images/shareIcon.svg";
import { dateTime } from '../utilities/dateTimeUtilites';
import { ShareForm } from './ShareForm';
import Ratings from '../utilities/Ratings';

/*
Card props:
open: boolean - whether card should be expanded or collapsed
cardInfo: CardInfo - info for the card - equivalent to the userMessage
*/


export class Card extends React.Component{
    constructor(props) {
        super(props);
        this.getHeaderStyles = this.getHeaderStyles.bind(this);
        this.getCardType = this.getCardType.bind(this);
        this.collapseCard = this.collapseCard.bind(this);
        this.expandCard = this.expandCard.bind(this);
        this.onClickShareButton = this.onClickShareButton.bind(this);
        this.state = {open: this.props.open, cardInfo: this.props.cardInfo, showingShareForm: false};
    }   

    render() {
        let shareForm = null;
        if (this.state.showingShareForm) {
            shareForm = this.getShareForm();
        }
        let card;
        if (this.state.open) {
            card = this.getOpenCard(shareForm);
        } else {
            card = this.getClosedCard();
        }

        return card;
    }

    getOpenCard(shareForm) {
        return (
            <div className="card-outline">
                <div className="card-top">
                    <img src={chevron} className="card-header-chevron-open" alt="chevron" onClick={this.collapseCard}></img>
                </div>
                <div className="card-header" style={this.getHeaderStyles()}>
                    <img src={bell} className="card-header-logo" alt="header-logo"/>
                    <span className="card-header-text">{this.getCardTitle()}</span>
                </div>
                <div className="card-body">
                    <div className="card-description">
                        {this.getCardDescription()}
                    </div>
                </div>
                <hr className="card-separator" />
                <div className="card-footer">
                    <img src={calendar} className="card-calendar-icon" alt="calendar"></img>
                    <img src={shareIcon} className="share-button" alt="share icon" onClick={this.onClickShareButton}></img>
                    {shareForm}
                </div>
            </div>
        )
    }

    getClosedCard() {
        return (
            <div className="card-outline">
                <div className="card-top">
                    <img src={chevron} className="card-header-chevron-closed" alt="chevron" onClick={this.expandCard}></img>
                </div>
                <div className="card-header" style={this.getHeaderStyles()}>
                    <img src={bell} className="card-header-logo" alt="header-logo"/>
                    <span className="card-header-text">{this.getCardTitle()}</span>
                </div>
                <div className="card-body">
                </div>
            </div>
        )
    }
    collapseCard() {
        this.setState({open: false});
    }

    expandCard() {
        this.setState({open: true});
    }

    // TO-DO: change color based on type of card (look in this.props.cardInfo)
    getHeaderStyles() {
        return {
            backgroundColor: "#FCEF50"
        };
    }

    // TO-DO: change type based on type of card (look in this.props.cardInfo)
    getCardType() {
        if (this.props.cardInfo.type) {
            return this.props.cardInfo.type
        } else {
            return "Review";
        }
    }

    // TO-DO: read title from actual PSA (look in this.props.cardInfo)
    getCardTitle() {
        if (this.props.cardInfo.name) {
            return this.props.cardInfo.name;
        } else {
            return "Name";
        }
    }

    // TO-DO; read from actual PSA (look in this.props.cardInfo)
    getStreetAddress() {
        if (this.props.cardInfo.street) {
            return this.props.cardInfo.street;
        } else {
            return "Street"
        }
    }

    // TO-DO; read from actual PSA (look in this.props.cardInfo)
    getCityStateZip() {
        let city = "city";
        let state = "state";
        let zip = "zip";
        if (this.props.cardInfo.city) {
            city = this.props.cardInfo.city;
        } 
        if (this.props.cardInfo.state) {
            state = this.props.cardInfo.state;
        }
        if (this.props.cardInfo.zip) {
            zip = this.props.cardInfo.zip;
        }

        return `${city}, ${state} ${zip}`;
    }

    // TO-DO; read from actual PSA (look in this.props.cardInfo)
    getCardDates() {
        let startDate = "start date";
        let endDate = "end date";
        if (this.props.startDate) {
            startDate = this.props.startDate;
        }
        if (this.props.endDate) {
            endDate = this.props.endDate;
        }
        const dates = `${startDate} to ${endDate}`;
        return dates;
    }

    getCardTimes() {
        let startTime = "start time";
        let endTime = "end time";
        if (this.props.startTime) {
            startTime = dateTime.translateTime(this.props.startTime);
        }
        if (this.props.endTime) {
            endTime = dateTime.translateTime(this.props.endTime);
        }
        const times = `${startTime} to ${endTime}`;
        return times;
    }

    getCardTimeZone() {
        let timeZone = dateTime.isDST() ? "PDT" : "PST";
        if (this.props.timeZone) {
            timeZone = this.props.timeZone;
        }
        return timeZone;
    }

    getCardDescription() {
        if (this.props.cardInfo) {
            return (
                <ul>
                    <li>Containers: {Ratings[this.props.cardInfo.containers]}</li>
                    <li>Cups: {Ratings[this.props.cardInfo.cups]}</li>
                    <li>Bags: {Ratings[this.props.cardInfo.bags]}</li>
                    <li>Utentils: {Ratings[this.props.cardInfo.utensils]}</li>
                </ul>
            )
        } else {
            return "Description";
        }
    }

    onClickShareButton() {
        if (!this.props.preview) {
            this.setState({ showingShareForm: true});
        }
    }

    getShareForm() {
        return <ShareForm id={this.props.messageId} timeStamp={this.props.messageTimestamp} />
    }
}
