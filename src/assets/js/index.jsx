'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet';

// Polyfills
import 'whatwg-fetch';

let App = React.createClass({
  getFix: function () {
    fetch('http://ice.portal/jetty/api/v1/status')
      .then(res => res.json())
      .then(({ speed, latitude, longitude }) => this.setState({
        fixes: [ { speed, position: [ latitude, longitude ], time: Date.now() }, ...this.state.fixes ].slice(0, 1000),
      }));
  },
  getPosition: function () {
    let { fixes } = this.state;
    if (fixes.length < 2) this.setState(fixes[0]);
    else {
      let now = Date.now();
      let dT = fixes[0].time - fixes[1].time;
      let dLat = fixes[0].position[0] - fixes[1].position[0];
      let dLon = fixes[0].position[1] - fixes[1].position[1];
      let dV = fixes[0].speed - fixes[1].speed;

      let amount = (now - fixes[0].time) / dT;
      this.setState({
        position: [
          fixes[0].position[0] + dLat * amount,
          fixes[0].position[1] + dLon * amount,
        ],
        speed: fixes[0].speed + dV * amount,
      });
    }
    requestAnimationFrame(this.getPosition);
  },
  getInitialState: function () {
    return { position: null, speed: null, fixes: [], };
  },
  componentDidMount: function () {
    requestAnimationFrame(this.getPosition);
    setInterval(this.getFix, 5000);
    this.getFix();
    setTimeout(this.getFix, 2000);
  },
  render: function () {
    if (!this.state.position) {
      return <p>Suche Position …</p>;
    }
    return <div>
      <div className="speed">{ this.state.speed.toFixed(0).replace('.', ',') } <small>km/h</small></div>
      <Map center={ this.state.position } zoom={this.state.zoom || 12} className="map" onZoomend={ev => this.setState({ zoom: ev.target._animateToZoom })}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={ this.state.position } />
        <Polyline
          positions={ [ this.state.position, ...this.state.fixes.map(f => f.position) ] }
          weight={3}
          color="#f00"
        />
      </Map>
    </div>;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  render(<App />, document.getElementById('app'));
});
