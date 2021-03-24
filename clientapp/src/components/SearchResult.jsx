import React from 'react';

/*
props: details: name, id, lat, long (one search result from yelp api),
 and onClick callback
*/

export class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <div onClick={this.handleClick} className="searchResult">
                {this.props.details.name}
            </div>
        );
    }

    handleClick() {
        this.props.onClick(this.props.details);
    }

}