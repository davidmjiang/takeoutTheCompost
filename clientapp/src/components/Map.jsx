import React from 'react';
import { BingMap } from '../utilities/mapUtilities';
/*setState
Map props:
mapInfo:
cards:
*/
export class Map extends React.Component {
    constructor(props) {
        super(props);
        this.loadMapScenario = this.loadMapScenario.bind(this);
        this.state = {mapInfo: this.props.mapInfo, cardInfo: this.props.cardInfo };       
    }

    componentDidMount(){
        window.onload = this.loadMapScenario;
    }

    componentDidUpdate(prevProps, prevState){
      if (prevProps.cardInfo !== this.props.cardInfo) {
        this.loadMapScenario();
      }
    }

    render() {
        return (
            <div id="CovidBingMap" style={{width: '100%', height: '100%'}}></div>
        )
    }

    
    loadMapScenario() {
        console.log('mapInfo:',this.props.mapInfo);
        console.log('cards:',this.props.cardInfo); //? []
        if(BingMap.getMap()==null){
          BingMap.init(); //One time here only
          const mapCenter = BingMap.getCenter();
          this.props.onMapInit(mapCenter);
        }        
        const cards = this.props.cardInfo;
        if(cards && cards.length > 0){
          let locations = [];
          cards.forEach((card) => {
              let lat = card.lat;
              let lon = card.lon;
              locations.push({latitude: lat, longitude: lon});

              BingMap.drawThePinByGeocoords(lat,lon, card);   
          });  
          BingMap.showCluster();
          BingMap.setLocationsView(locations, 80);
        }
    }

    getAddress(card){
      try{
          let parsedInfo = JSON.parse(card.userMessage);
          if(parsedInfo.street && parsedInfo.city && parsedInfo.state && parsedInfo.zip){
            //address
            console.log("Address:", [parsedInfo.street,parsedInfo.city,parsedInfo.state,parsedInfo.zip].join(' '));
            return [parsedInfo.street,parsedInfo.city,parsedInfo.state,parsedInfo.zip].join(' ');
          }else{ //zip
            return null;
          }   
        } catch(e) {
            console.log("JSON.parse error:", card.userMessage);
            return null;
        }
    }
}