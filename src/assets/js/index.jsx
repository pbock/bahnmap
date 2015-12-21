'use strict';

import L from 'leaflet';
import React from 'react';
import { render } from 'react-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Map, TileLayer, LayersControl, Polyline } from 'react-leaflet';

import geoDistance from './lib/geo-distance';

// Polyfills
import 'whatwg-fetch';

let Speedometer = React.createClass({
  render: function () {
    // A bit inaccurate since our samples won't be *quite* evenly spaced
    // along the x axis, but meh.
    let data = [ this.props.speed, ...this.props.fixes.slice(0, 30).map(f => f.speed) ].reverse();
    return <div className="speedometer">
      <Sparklines data={data} width={150} height={25} min={0}>
        <SparklinesLine color="#f00" />
      </Sparklines>
      <span className="speed">{ this.props.speed.toFixed(0) } <small>km/h</small></span>
    </div>;
  },
});

let App = React.createClass({
  getFix: function () {
    fetch('/jetty/api/v1/status')
      .then(res => res.json())
      .then(({ speed, latitude, longitude }) => {
        let fixes = [ { speed, position: [ latitude, longitude ], time: Date.now() }, ...this.state.fixes ].slice(0, 1000);
        this.setState({ fixes });
        localStorage.fixes = JSON.stringify(fixes);
      } );
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
    let fixes = localStorage.fixes ? JSON.parse(localStorage.fixes) : [];
    return { position: null, speed: null, fixes, };
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
    let trail = [ this.state.position, ...this.state.fixes.map(f => f.position) ];
    let train = lineWithLength(trail, 100);

    return <div>
      <Speedometer speed={this.state.speed} fixes={this.state.fixes} />
      <Map center={ this.state.position } zoom={this.state.zoom || 12} className="map" onZoomend={ev => this.setState({ zoom: ev.target._animateToZoom })}>
        <TileLayer
          url="http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"
          attribution={'&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
        />
        <Polyline
          positions={ trail }
          weight={4}
          opacity={0.9}
          color="#f00"
        />
        <Polyline
          positions={ lineWithLength(trail, 150) }
          weight={11}
          color="#000"
          opacity={0.3}
        />
        <Polyline
          positions={ lineWithLength(trail, 150) }
          weight={7}
          color="#fff"
          opacity={1}
        />
      </Map>
    </div>;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  render(<App />, document.getElementById('app'));
});

function interpolate(a, b, amount) {
  return a + (b - a) * amount;
}

function lineWithLength(positions, length) {
  let currentLength = 0;
  let outputPositions = [ positions[0] ];
  for (let i = 1; i < positions.length; i++) {
    let prev = positions[i - 1];
    let cur = positions[i];
    let distance = geoDistance(prev, cur);

    if (currentLength + distance < length) {
      outputPositions.push(cur);
      currentLength += distance;
      continue;
    }

    // Our line is longer than it needs to be
    let missingLength = length - currentLength;
    let amount = missingLength / distance;
    outputPositions.push([
      interpolate(prev[0], cur[0], amount),
      interpolate(prev[1], cur[1], amount),
    ]);
    return outputPositions;
  }

  // Our line is too short
  return positions;
}
