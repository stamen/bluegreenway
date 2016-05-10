import * as React from 'react';

export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
		this.initMap = this.initMap.bind(this);
	}

	componentWillMount() {
		this.onStateChange();
	}

	componentDidMount() {
		this.initMap();
	}

	componentWillUpdate(nextProps) {

	}

	componentWillUnmount() {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState().map;
		this.setState(storeState);
	}

	initMap() {
		const that = this;
		const vizJSON = 'https://stamen.cartodb.com/u/stamen-org/api/v2/viz/4d180fa8-0e3d-11e6-aa9a-0ea31932ec1d/viz.json';
		const options = {
			cartodb_logo: false,
			// center_lat: 37.759892,
			// center_lon: -122.418079,
			center: [37.757450, -122.406235],
			infowindow: false,
			legends: false,
			scrollwheel: false,
			search: false,
			zoom: 14,
			zoomControl: false
		};
		cartodb.createVis('map', vizJSON, options)
			.on('done', (vis, layers) => {
				console.log(vis, layers);
				const map = vis.getNativeMap();
				that.setState({ map });
			})
			.on('error', err => {
				console.warn(err);
			});
	}

	render() {
		return (
			<div id='map' ref='leafletMap' className='map-container' />
		);
	}
}
