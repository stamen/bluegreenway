import * as React from 'react';
import { withRouter } from 'react-router';
import times from 'lodash/times';
import Packery from 'packery';
import moment from 'moment';

import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import { MapOverlayContainer, MapOverlay } from '../components/MapOverlay';
import MapPOILegend from '../components/MapPOILegend';
import Event from '../components/Event';
import Story from '../components/Story';
import { getCategoryOptions, getCategoryMapLayerOptions } from '../models/stories';
import { getTypesOptions, getTypesMapLayerOptions } from '../models/events';

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

		// set map layers
		actions.mapLayersPickerStoriesChange(true);
		actions.mapLayersPickerEventsChange(true);
		actions.mapLayersPickerProjectsChange(true);

		this.setState({
			packeryLoaded: false
		});
	}

	componentWillUpdate (nextProps, nextState) {
		const { stories, events } = this.props.store.getState();
		if (stories.data.items.length && !stories.categoryOptions.length) {
			// stories have loaded but filter options have not yet been derived
			this.deriveFilterOptions(stories, null);
		}
		if (events.data.items.length && !events.eventTypeOptions.length) {
			// events have loaded but filter options have not yet been derived
			this.deriveFilterOptions(null, events.data.items);
		}
	}

	deriveFilterOptions (stories, events) {
		let { actions } = this.props;
		if (stories) {
			actions.storyCategoriesChange(getCategoryOptions(stories));
			actions.mapLayersPickerStoryCategoriesChange(null, null, getCategoryMapLayerOptions(stories));
		}

		if (events) {
			actions.eventTypesChange(getTypesOptions(events));
			actions.mapLayersPickerEventTypesChange(null, null, getTypesMapLayerOptions(events));
		}
	}

	componentDidUpdate (prevProps) {
		// init packery after dom elements are rendered
		if (this.refs.gridContainer && this.refs.gridContainer.children.length > 3) {
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
				event: this.reorderEvents(storeState.events.data.items.concat())
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
			defaultImageIndex = 1;
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
					defaultImageIndex = (defaultImageIndex++ % 6) + 1;
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


	// order events like so:
	// start from current date and walk forward until end of event list
	// then fill out any remaining events in the layout in reverse chronological order,
	// moving backwards from today's date.
	// e.g. if today is the 20th, events might look like this:
	// [20, 24, 25, 27, 19, 15, 13, 12]
	reorderEvents (events) {

		let now = moment(),
			futureEvents = events.filter(e => e.startDate.isAfter(now)),
			pastEvents = events.filter(e => e.startDate.isBefore(now)).reverse();

		return futureEvents.concat(pastEvents);

	}

	renderMapView () {
		let { mapLayersPicker } = this.props.store.getState();
		return (
			<MapOverlayContainer>
				<MapOverlay>
					<MapLayersPicker
						title='Stories'
						layers={ mapLayersPicker.storyCategories }
						onLayerChange={ this.props.actions.mapLayersPickerStoryCategoriesChange }
					/>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Events'
						layers={ mapLayersPicker.eventTypes }
						onLayerChange={ this.props.actions.mapLayersPickerEventTypesChange }
					/>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Recreation'
						layers={ mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					>
						<MapPOILegend/>
					</MapLayersPicker>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Transportation'
						layers={ mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</MapOverlayContainer>
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
