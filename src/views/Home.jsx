import * as React from 'react';
import { withRouter } from 'react-router';
import times from 'lodash/times';
import Packery from 'packery';
import moment from 'moment';

import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import Event from '../components/Event';
import Story from '../components/Story';

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
		//
	}

	componentWillUpdate (nextProps, nextState) {
		//
	}

	componentDidUpdate (prevProps) {
		// init packery after dom elements are rendered
		if (this.refs.gridContainer.children.length > 3) {
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

		pckry.once('layoutComplete', () => {
			// callback for packery init
		  grid.classList.add('loaded');
		});

		pckry.layout();
	}

	renderGridItems () {
		let storeState = this.props.store.getState(),
			itemsByType = {
				story: storeState.stories.data.items.filter(item => item.category !== 'People of the Blue Greenway'),
				people: storeState.stories.data.items.filter(item => item.category === 'People of the Blue Greenway'),
				event: storeState.events.data.items.concat()
			};

		let gridItemTypes = [
			'people',
			'story',
			'event',
			'event',
			'event',
			'people',
			'story',
			'event',
			'people',
			'story',
			'event',
			'event',
			'event',
			'people',
			'story',
			'event'
		];

		let items = gridItemTypes.map(type => {
			if (!itemsByType[type].length) {
				if (type === 'event') {
					// create dummy (filler) event
					itemsByType[type].push({
						startDate: moment(),
						endDate: moment(),
						title: "Coming Soon...",
						cost: "N/A"
					});
				} else {
					// TODO: find a way to fail more gracefully than this,
					// e.g. pull from a different itemsByType list.
					throw new Error(`Not enough items of type ${ type } to complete the layout.`);
				}
			}

			return {
				[type]: itemsByType[type].shift()
			};
		});

		// create divs with corresponding classNames that determine width & height for use with Packery & Skeleton grid
		// inside divs reside a corresponding story or event component
		let isPeople,
			defaultImageIndex = 0;
		let divs = items.map((item, idx) => {
			isPeople = item.people;
			if (isPeople) {
				item.story = item.people;
			}

			if (item.story) {
				// assign a class for the grid item to be taller
				let storyClassNames;

				if (isPeople) {
					// people stories are formatted as 1x2 grid items
					storyClassNames = 'grid-item grid-item--tall three columns';
				} else {
					// non-people stories are formatted as 2x1 grid items
					storyClassNames =  'grid-item six columns';
				}

				return (
					<div className={ storyClassNames } key={ item.story.id }>
						<Story
							{ ...item.story }
							homepage={ true }
							onClick={ this.props.actions.updateSelectedStory }
							router={ this.props.router }
							mode={ this.props.params.mode } />
					</div>
				);
			} else if (item.event) {
				if (!item.event.photoURL) {
					defaultImageIndex = ++defaultImageIndex % 6;
				}
				
				return (
					<div className='grid-item three columns' key={ item.event.startDate.format('YYYYMMDD') + item.event.id }>
						<Event
							{ ...item.event }
							homepage={ true }
							defaultImageIndex={ defaultImageIndex }
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
				<div className='grid-sizer three columns' />
				<div className='gutter-sizer' />
				<div className='grid-item twelve columns'>
					<PageHeader />
				</div>
				{ stories.data.items.length && events.data.items.length ?
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
