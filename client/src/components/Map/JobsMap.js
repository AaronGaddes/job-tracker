import React from 'react';
import { Map, Marker, Popup, TileLayer, Polyline, Polygon, AttributionControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './JobsMap.module.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


export default function JobsMap(props) {

    const {location, polygonpoints} = props;

    const position = [location.latitude, location.longitude]

    const mapStyles = {
        position:"absolute",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "0",
        boxSizing: "border-box",
        height: "100%"
    }

    const switchLatLong = (latlongs) => {
        return latlongs.map(latlong => {
            return [latlong[1],latlong[0]]
        })
    }

    return(
            <Map
                style={mapStyles}
                zoomControl={false}
                doubleClickZoom={false}
                dragging={false}
                keyboard={false}
                scrollWheelZoom={false}
                center={position}
                attributionControl={false}
                zoom={16}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <AttributionControl
                position="topright"></AttributionControl>
                <Marker position={position}>
                {/* <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup> */}
                </Marker>
                {polygonpoints && <Polygon positions={switchLatLong(polygonpoints)} />}
            </Map>
    )

}