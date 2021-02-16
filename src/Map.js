import React from 'react';
import {MapContainer as LeafletMap, TileLayer} from "react-leaflet";
import {showDataOnMap} from './util.js';
import  './map.css';

function Map(props) {
    return (
        <div className="map">
            {console.log(props.zoom)}
            <LeafletMap center={props.center} zoom={props.zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {showDataOnMap(props.countries, props.casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map;
