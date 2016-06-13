import * as React from 'react';
import Masonry from 'masonry-layout';

import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';

export default class Home extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.props.actions.mapLayersPickerProjectsChange(false);
	}

	componentDidMount () {
		if (this.props.params.mode === 'page') this.initMasonry();
	}

	componentWillReceiveProps (nextProps) {
		//
	}

	componentWillUpdate (nextProps, nextState) {
		//
	}

	componentDidUpdate (prevProps) {
		if (prevProps.params.mode !== this.props.params.mode &&
			prevProps.params.mode === 'map') this.initMasonry();
	}

	initMasonry () {
		const grid = document.querySelector('.grid-container');
		const msnry = new Masonry(grid, {
			columnWidth: '',
			columnWidth: '.grid-sizer',
			itemSelector: '.grid-item',
			percentPosition: true,
			gutter: 10
		});

		msnry.once('layoutComplete', () => {
		  grid.classList.add('load');
			console.log('masonry loaded');
		});

		msnry.layout();
	}

	renderMapView () {
		let { mapLayersPicker } = this.props.store.getState();
		return (
			<div className="projects-map-overlay">
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</div>
		);
	}

	renderPageView () {
		return (
			<div className='grid-container'>
				<PageHeader />
			</div>
		);
	}

	render () {
		return (
			<div id='home'>
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

}
