import * as React from 'react';
import { withRouter } from 'react-router';
import times from 'lodash/times';
import Packery from 'packery';

import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import Event from '../components/Event';
import Story from '../components/Story';

let defaultImageIndex = 6;

class Home extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		const { projects, stories, events } = this.props.store.getState();
		const { actions } = this.props;
		// if (!projects.data.items.length) actions.fetchProjectsData();
		if (!stories.data.items.length) actions.fetchStoriesData();
		if (!events.data.items.length) actions.fetchEventsData();
		actions.mapLayersPickerProjectsChange(false);
		this.setState({
			packeryLoaded: false
		});
	}

	componentDidMount () {
		//
	}

	componentWillReceiveProps (nextProps) {

	}

	componentWillUpdate (nextProps, nextState) {
		//
	}

	componentDidUpdate (prevProps) {

		// if (prevProps.params.mode !== this.props.params.mode &&
		// 	prevProps.params.mode === 'map') this.initMasonry();

		if (this.refs.gridContainer.children.length > 1) {
			this.initPackery();
		}
	}

	initPackery () {
		const grid = this.refs.gridContainer;
		const pckry = new Packery(grid, {
			columnWidth: '.grid-sizer',
			gutter: '.gutter-sizer',
			itemSelector: '.grid-item',
			percentPosition: true
		});

		// console.log(pckry);

		pckry.once('layoutComplete', () => {
		  grid.classList.add('loaded');
			console.log('packry loaded');
		});

		pckry.layout();
	}

	renderGridItems () {
		const { stories, events } = this.props.store.getState();
		const sLen = stories.data.items.length;
		const eLen = events.data.items.length;

		// iterate over events, featured person profiles(?), & stories
		let len = 7; // Math.max(pLen, sLen, eLen);
		let items = [];
		times(len, (i)=> {
			if (i < 2) {
				if (events.data.items[i]) items.push({event: events.data.items.slice(i, i + 1)[0]});
			}
			if (stories.data.items[i]) items.push({story: stories.data.items.slice(i, i + 1)[0]});
		});

		console.log(items);

		// create divs with corresponding classNames that determine width & height
		let divs = items.map((item, idx) => {
			if (item.story) {
				item.story.homepage = true;
				let itemTall = idx % 2 === 0 ? 'grid-item--tall' : '';
				return (
					<div className={`grid-item six columns ${itemTall}`} key={item.story.id}>
						<Story
							{...item.story}
							onClick={this.props.actions.updateSelectedStory}
							router={this.props.router}
							mode={this.props.params.mode} />
					</div>
				);
			} else if (item.event) {
				item.event.homepage = true;
				item.event.defaultImageIndex = defaultImageIndex;
				defaultImageIndex -= 1;
				if (defaultImageIndex === 0) defaultImageIndex = 6;

				return (
					<div className='grid-item three columns' key={ item.event.startDate.format('YYYYMMDD') + item.event.id }>
						<Event
						{...item.event }
						/>
					</div>
				);
			}
		});

		return divs;
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
		const { projects, stories, events } = this.props.store.getState();
		return (
			<div ref='gridContainer' className='grid-container'>
				<div className='gutter-sizer' />
				<div className='grid-sizer three columns' />
				<div className='grid-item twelve columns'>
					<PageHeader />
				</div>
				{ stories.data.items.length && events.data.items.length?
					this.renderGridItems() : <h3>Loading, hang tight...</h3> }
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

export default withRouter(Home);
