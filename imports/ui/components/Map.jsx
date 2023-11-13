import React, { Component } from "react";
import map from "../../api/classes/client/utilities/map";

class Map extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            map: null,
        }
    }
    async componentDidMount() {
        let [longitude, latitude] = await map.getUserLocation();
        const instance = map.initialize('map', longitude, latitude)
        this.setState({
            map: instance
        });
        this.props.handleInstance(instance);
    }
    render() {
        return (
            <div id="map" className="map-container"></div>
        )
    }
}



export default Map;