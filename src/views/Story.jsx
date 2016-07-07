import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import { get } from 'lodash';

import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

class Story extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillUpdate (nextProps, nextState) {
		this.updateSelectedStory(nextProps);
	}

	componentWillMount () {
		if (!this.props.store.getState().stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		} else {
			this.updateSelectedStory(this.props);
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

	updateSelectedStory (props) {
		const storeState = props.store.getState();
		let storyTitle = props.params.title || storeState.stories.selectedStory.title,
			{ query } = props.location,
			id = query && query.id ? +query.id : null;

		if (id && !storeState.stories.selectedStory) {
			storeState.stories.data.items.forEach(story => {
				if (story.title === storyTitle) {
					this.props.actions.updateSelectedStory({
						id,
						title: story.title
					});
				}
			});
		}
	}

	render () {
		return (
			<div id="story" className='grid-container'>
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		const storeState = this.props.store.getState();
		if (!storeState.stories.data.items.length || !storeState.stories.selectedStory) {
			return null;
		}

		const stories = get(storeState, 'stories.data.items'),
			selectedStory = get(storeState, 'stories.selectedStory');
		let storyData = stories.find(item => item.title === selectedStory.title),
			{ body } = storyData;

		if (body) {
			// write to offscreen DOM in order to do some manipulation...
			let storyDoc = new DOMParser().parseFromString(body, 'text/html'),
				storyDocBody = storyDoc.querySelector('body'),
				secondParagraph = storyDoc.querySelector('p:nth-of-type(2n+0)');

			if (storyDocBody) {
				// Insert title at the top
				let titleContainer = document.createElement('div');
				titleContainer.classList.add('story-title');
				titleContainer.textContent = storyData.title.replace(/_/g, ' ');
				storyDocBody.insertBefore(titleContainer, storyDocBody.firstChild);

				// And then images above that (if we have any)
				if (storyData.images && storyData.images.length) {
					let imageContainer = document.createElement('div');
					imageContainer.classList.add('image-container');

					// insert after subtitle element
					storyDocBody.insertBefore(imageContainer, secondParagraph);
					storyData.images.forEach(image => {
						let img = document.createElement('img');
						img.setAttribute('src', image.src);
						if (image.alt) img.setAttribute('alt', image.alt);
						imageContainer.appendChild(img);
					});
				}

				// dump back into a string to pass off to React
				body = storyDocBody.innerHTML;
			}
		}

		return (
			<div className='row'>
				<div className='eight columns story-post' dangerouslySetInnerHTML={{ __html: body || ''}} />
			</div>
		);
	}

	renderMapView () {
		const storeState = this.props.store.getState();
		return (
			<div>
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
}

export default withRouter(Story);
