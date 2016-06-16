import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

class Story extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = nextProps.store.getState();
		let storyTitle = nextProps.params.title || storeState.stories.selectedStory.title,
			{ query } = this.props.location,
			id = query && query.id ? +query.id : null;

		// for when the app loads with the URL of a specific story
		// if (this.state.stories.data.items !== nextState.stories.data.items &&
		// 	!storeState.stories.selectedStory) {
		if (id && !storeState.stories.selectedStory) {
			this.updateSelectedStory(id, storyTitle, storeState.stories.data.items);
		}
	}

	updateSelectedStory (id, title, stories) {
		stories.forEach(story => {
			if (story.title === title) {
				this.props.actions.updateSelectedStory({
					id,
					title: story.title
				});
			}
		});
	}

	componentWillMount () {
		if (!this.props.store.getState().stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}
	}

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.storiesMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.storiesMaxDateChanged(range[1]);
		}
	}

	renderPageView () {
		const storeState = this.props.store.getState();
		if (!storeState.stories.data.items.length || !storeState.stories.selectedStory) {
			 return false;
		}
		const storiesData = this.props.store.getState().stories;
		const stories = storiesData.data.items;
		const selectedStory = storiesData.selectedStory;
		let storyData = storiesData.data.items.filter(item => {
			return item.title === selectedStory.title;
		});
		storyData = storyData.length ? storyData[0] : null;

		return (
			<div className='row'>
				<div className='eight columns story-post' dangerouslySetInnerHTML={{ __html: storyData ? storyData.body : ''}} />
			</div>
		);
	}

	renderMapView () {
		const storeState = this.props.store.getState();
		return (
			<div className='stories-map-overlay'>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ storeState.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ storeState.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</div>
		);
	}

	render () {
		return (
			<div id="story" className='grid-container'>
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}
}

export default withRouter(Story);