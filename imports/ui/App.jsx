import React, { Component } from 'react';
import Map from './components/Map';
import "./stylesheets/main.css";
import assigner from '../api/classes/client/utilities/assingner';
import { assignParcelsToRiders, nearestNeighborAlgorithm } from '../api/classes/client/utilities/assingergpt';

class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            map: null,
            isSelectingHQ: false,
            isSelectingParcelLoc: false,
            parcelcoordinates: [],
            hqcoodinates: null,
            capacity: 0,
            riders: [],
        }
    }
    setHQ(coordinates) {
        this.setState({
            hqcoodinates: [coordinates.lng, coordinates.lat],
            isSelectingHQ: false,
        });
        this.state.map.addSource('hq', {
            type: 'geojson',
            data: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat],
                }
            }
        });
        this.state.map.addLayer({
            id: 'hq-point',
            type: 'circle',
            source: 'hq',
            paint: {
                'circle-radius': 8,
                'circle-color': 'red',
            }
        })
    }
    addParcelCoordinates(id, coordinates) {
        this.setState((prevState) => ({
            parcelcoordinates: [...prevState.parcelcoordinates, [coordinates.lng, coordinates.lat]],
        }));
        this.state.map.addSource(`${id}`, {
            type: 'geojson',
            data: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat],
                },
                properties: {
                    description: `Customer-${id}`,
                }
            }
        });
        this.state.map.addLayer({
            id: `parcel-point-${id}`,
            type: 'circle',
            source: `${id}`,
            paint: {
                'circle-radius': 8,
                'circle-color': 'blue',
            },
        })
    }
    handleMapInstance = (map) => {
        this.setState({
            map: map,
        }, () => {
            this.state.map.on('click', (e) => {
                const coordinates = e.lngLat;
                this.state.isSelectingHQ ? this.setHQ(coordinates) : null;
                this.state.isSelectingParcelLoc ? this.addParcelCoordinates(Math.random(), coordinates) : null;
            })
        })
    }
    setHeadQuarters() {
        this.setState({
            isSelectingHQ: true,
        })
    }
    addPercelLocation() {
        this.setState({
            isSelectingParcelLoc: !this.state.isSelectingParcelLoc,
        })
    }
    calculateDistance(coord1, coord2) {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        const radius = 6371;
        const lat1Rad = (Math.PI * lat1) / 180;
        const lat2Rad = (Math.PI * lat2) / 180;
        const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
        const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = radius * c;
        return distance;
    }
    calculate() {
        let assign = new assigner(this.state.hqcoodinates, this.state.parcelcoordinates);
        let riders = assign.calculate(this.state.capacity);
        console.log(this.state.capacity);
        nearestNeighborAlgorithm(this.state.hqcoodinates, this.state.parcelcoordinates, this.state.capacity);
        this.setState({
            riders: riders,
        });
        // console.log(this.state.parcelcoordinates);
        // for (let i = 0; i < this.state.parcelcoordinates.length; i++) {
        //     for (let j = 0; j < this.state.parcelcoordinates.length; j++) {
        //         for (let k = 0; k < this.state.parcelcoordinates.length; k++) {
        //             let temp = this.calculateDistance(this.state.parcelcoordinates[i], this.state.parcelcoordinates[j]);
        //             let temp2 = this.calculateDistance(this.state.parcelcoordinates[j], this.state.parcelcoordinates[k]);
        //             let total = temp + temp2;
        //             console.log(`[${i}, ${j}, ${k}] - ${total}`);
        //         }
        //     }
        // }
    }
    onZoom(lng, lat) {
        this.state.map.setCenter([lng, lat]);
        // this.state.map.setZoom(9);
    }
    onCapacityChange(event) {
        this.setState({
            capacity: event.target.value,
        })
    }
    getRandomHexColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    onRIderClick(rider) {
        let color = this.getRandomHexColor();
        for (let i = 0; i < rider.length; i++) {
            let id = Math.random();
            this.state.map.addSource(`${id}`, {
                type: 'geojson',
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [this.state.parcelcoordinates[rider[i] - 1][0], this.state.parcelcoordinates[rider[i] - 1][1]],
                    }
                }
            });
            this.state.map.addLayer({
                id: `hq-${id}`,
                type: 'circle',
                source: `${id}`,
                paint: {
                    'circle-radius': 8,
                    'circle-color': color,
                }
            })
        }
    }
    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ width: "50%" }}>
                    <Map handleInstance={this.handleMapInstance} />
                    <br /><br /><br />
                </div>
                <div style={{ width: "50%" }}>
                    <button onClick={this.setHeadQuarters.bind(this)}>Set headquarter</button><button onClick={this.addPercelLocation.bind(this)}>Add parcel locations</button>
                    <p>head quarter(red): {this.state.hqcoodinates ? `${this.state.hqcoodinates[0]}, ${this.state.hqcoodinates[1]}` : ""}</p>
                    <p>Parcels: </p>
                    <ul>
                        {this.state.parcelcoordinates.map((coordinate, index) => {
                            return (
                                <li key={index} onClick={() => this.onZoom(coordinate[0], coordinate[1])}>{index + 1} {`${coordinate[0]}, ${coordinate[1]}`}</li>
                            )
                        })}
                    </ul>
                    <br /><br />
                    <label htmlFor="">Capacity per rider</label><input type="number" value={this.state.capacity} onChange={this.onCapacityChange.bind(this)} />
                    <button onClick={this.calculate.bind(this)}>Calculate</button>

                    <br /><br /><br />
                    <h4>Assigned Parcel</h4>
                    {
                        this.state.riders.map((rider, index) => {
                            return (
                                <p onClick={() => this.onRIderClick(rider)} key={index}>Rider{index + 1} - Parcel No. {rider.map((element, index) => { return (<span key={index}>{element},</span>) })}</p>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}



export default App;