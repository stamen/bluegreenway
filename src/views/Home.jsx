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
		const { stories, events } = this.props.store.getState();
		// create a new array for homepage events & stories, must be a grouping of 7 elements
		// should look like: [story, story, story, event, story, story, event]
		// should pull from stories about featured people, the most recent other stories, and most recent events
		let len = 7;
		let items = [];
		times(len, (i)=> {
			if (i < 3) {
				// first three elements should be stories
				if (stories.data.items[i]) {
					items.push({
						story: Object.assign({},
							stories.data.items.slice(i, i + 1)[0]
						)
					});
				}
			}
			if (i > 3 && i < 6) {
				// 4th and 5th zero based indexed elements should be stories
				let x = i - 1;
				if (stories.data.items[x]) {
					items.push({
						story: Object.assign({},
							stories.data.items.slice(x, x + 1)[0]
						)
					});
				}
			}
			if (i === 3 || i === 6) {
				// 3rd and 6th zero based indexed elements should be events
				let n;
				if (i === 3) n = 0;
				if (i === 6) n = 1;
				if (events.data.items[n]) {
					items.push({
						event: Object.assign({},
							events.data.items.slice(n, n + 1)[0]
						)
					});
				}
			}
		});

		// create divs with corresponding classNames that determine width & height for use with Packery & Skeleton grid
		// inside divs reside a corresponding story or event component
		let divs = items.map((item, idx) => {
			if (item.story) {
				item.story.homepage = true;
				// assign a class for the grid item to be taller
				// todo: assign this class only when item.story.category is for featured persons of BGW
				let storyClassNames;

				if (idx === 0 || idx === 2 || idx === 4) {
					storyClassNames = 'grid-item grid-item--tall three columns';
				} else {
					storyClassNames =  'grid-item six columns';
				}

				return (
					<div className={storyClassNames} key={item.story.id}>
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
				<div className='grid-sizer three columns' />
				<div className='gutter-sizer' />
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
