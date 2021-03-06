import * as React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import { Timeline } from 'react-twitter-widgets';

import MapLayersPicker from '../components/MapLayersPicker';
import { MapOverlayContainer, MapOverlay } from '../components/MapOverlay';
import MapPOILegend from '../components/MapPOILegend';
import PageHeader from '../components/PageHeader';
import BrochureModal from '../components/BrochureModal';

class About extends React.Component {

	constructor (props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
		this.openBrochureModal = this.openBrochureModal.bind(this);
		this.onBrochureModalClose = this.onBrochureModalClose.bind(this);
	}

	componentWillMount () {
		this.setState({});

		// set map layers
		this.props.actions.mapLayersPickerStoriesChange(false);
		this.props.actions.mapLayersPickerEventsChange(false);
		this.props.actions.mapLayersPickerProjectsChange(true);

		this.onStateChange();
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	openBrochureModal () {
		this.setState({ brochureModalIsOpen: true });
	}

	onBrochureModalClose () {
		this.setState({ brochureModalIsOpen: false });
	}

	renderMapView () {
		return (
			<MapOverlayContainer>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ this.state.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					>
						<MapPOILegend/>
					</MapLayersPicker>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ this.state.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</MapOverlayContainer>
		);
	}

	renderPageView () {
		let twitterHeight = window.innerWidth < 768 ? '80vh' : 750;		// $breakpoint-small in _variables.scss
		return (
			<div className="grid-container">
				<PageHeader />
				<h2>About the Blue Greenway</h2>
				<div className='sidebar' style={{ float: 'right' }}>
					<div onClick={ this.openBrochureModal } className='brochure'>
						<img src='./img/brochure-thumb.jpg' alt='Blue Greenway brochure-map'/>
						<div className='shade'></div>
						<h3>View the brochure</h3>
					</div>
					<Timeline
						options={{
							height: twitterHeight,
							width: '100%'	// from _about.scss
						}}
						widgetId={'725404019116675072'} />
				</div>
				<p>The Blue Greenway is a multi-agency effort to create an interconnected system of trails and parks on San Francisco’s southeast waterfront. Once complete, it will transform this neglected resource into a premier series of public open spaces: 13 miles of waterfront parks and trails running from AT&T Park south to Candlestick Point. The Blue Greenway project will complete San Francisco’s portions of the Bay Trail and Bay Water Trail, and provide active transportation routes connecting San Francisco’s growing eastern neighborhoods with the employment centers of Mission Bay and downtown.</p>
				<p>The Blue Greenway is will also provide much-needed open space, recreation, and active transportation opportunities to the city’s lowest-income and most underserved neighborhoods.</p>
				<p>These neighborhoods are slated to grow by more than 30,000 new residents over the next 20 years. The new open space network will connect these neighborhoods to their waterfront and serve as a catalyst for high-quality  development, employment opportunities and economic vitality. The southeastern neighborhoods have been plagued by the loss of the city’s maritime industries and the environmental contamination that these industries left behind. The Blue Greenway brings together numerous government, private sector, and nonprofit efforts to clean up toxic contaminants along the waterfront and turn these formerly unusable parcels of land into areas for public enjoyment, active recreation, and economic activity.</p>
				<p>The San Francisco Parks Alliance is leading efforts to move the Blue Greenway from a vision to a reality! The Parks Alliance invites you to imagine the Blue Greenway. Enjoy 13 miles of new parks and trails along San Francisco’s southeast waterfront. Whether you live in Bayview or Hunters Point, work in SOMA, go to ballgames, or find it another way, the Blue Greenway will make it easy for you to get outside and connect to the Bay.</p>
				{/*
				<h2>Join the SF Parks Alliance and Bring the Blue Greenway to Life</h2>
				<p>Your support will make the entire Blue Greenway a reality. Imagine 13 miles of beautiful shoreline everyone can enjoy.
					<ul>
						<li>Visit its parks and beaches.</li>
						<li>Volunteer for cleanups.</li>
						<li>Help design new parks, playgrounds, and plazas.</li>
						<li>Call for safer streets and new trails for walking and biking.</li>
						<li>Find out about new development on the waterfront.</li>
						<li>Give financial support to the Blue Greenway.</li>
					</ul>
				</p>

				<h2>To support this vision and sign up for the latest news:</h2>
				<p>
					<ul>
						<li><a href="http://sfpa.convio.net/site/Survey?ACTION_REQUIRED=URI_ACTION_USER_REQUESTS&SURVEY_ID=1540">Sign up for our newsletter</a></li>
						<li><a href="https://comcast.app.box.com/s/w2opjc93uewsp2ms5igni7vm5t9fkvoj">Video on the Blue Greenway</a></li>
					</ul>
				</p>
				*/}
				<h2>Blue Greenway Donors</h2>
				<div className='p'>The great work of the Blue Greenway would be impossible without the generous, long-standing support of many funders. We deeply appreciate the investments that have been made by the following:
					<ul>
						<li>The William and Flora Hewlett Foundation</li>
						<li>Eucalyptus Foundation</li>
						<li>The San Francisco Foundation</li>
						<li>Wells Fargo</li>
						<li>City and County of San Francisco</li>
						<li>Walter and Elise Haas, Sr. Fund</li>
						<li>Gerbode Foundation</li>
						<li>Pacific Gas and Electric</li>
						<li>Build Inc.</li>
						<li>Forest City</li>
						<li>Anonymous donors</li>
					</ul>
				</div>
			</div>
		);
	}

	render () {
		return (
			<div id='about'>
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
				<BrochureModal
					isOpen={ this.state.brochureModalIsOpen }
					onClose={ this.onBrochureModalClose }
				/>
			</div>
		);
	}

}

export default withRouter(About);
