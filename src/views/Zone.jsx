import React, { Component } from 'react';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

export default class Zone extends Component {
  constructor(props) {
    super(props);
    this.onStateChange = this.onStateChange.bind(this);
    this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
  }

  onStateChange () {
    let storeState = this.props.store.getState();
    this.setState(storeState);
  }

  componentWillUpdate(nextProps, nextState) {
    const urlMode = nextProps.params.mode;
    const appMode = nextProps.store.getState().mode;
    const zoneTitle = this.props.params.zone;
    if (urlMode !== appMode) {
      this.updateModeUrl(appMode, zoneTitle);
    }
  }

  updateModeUrl (mode, zoneTitle) {
    this.props.history.push(`/projects/${mode}/${zoneTitle}`);
  }

  componentWillMount () {
    if (!this.props.store.getState().projects.data.items.length) {
      this.props.actions.fetchProjectsData();
    }
    this.onStateChange();
  }

  componentDidMount () {
    //
  }

  componentWillUnmount () {
    this.unsubscribeStateChange();
  }

  componentDidUpdate () {
    //
  }

  renderProjectList () {
    // renders the list of projects for the given zone from?
  }

  renderOpenSpacesList () {
    // renders the list of open spaces for the given zone from?
  }

  renderPageView () {
    let zoneTitle = this.props.params.zone.split('_').join(' ');
    const title = 'title';
    const about = 'some about text';
    return (
      <div className='accordian-wrapper row'>
        <div className='title-container'>
          <h1 className='title'>{zoneTitle}</h1>
          <p>{about}</p>
          {/* to do: image? */}
          <button>View on Map</button>
        </div>
        <div className='projects-list'>
          <h4>Projects</h4>
          {this.renderProjectList()}
        </div>
        <div className='open-spaces-list'>
          <h4>Open Spaces</h4>
          {this.renderOpenSpacesList()}
        </div>
      </div>
    );
  }

  renderMapView () {
		return (
			<div className='stories-map-overlay two columns'>
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
				<MapOverlay collapsible={true}>
					<DateRange
						minDate={moment('1/1/2016', 'M/D/YYYY')}
						maxDate={moment()}
						initialStartDate={this.state.stories.startDate}
						initialEndDate={this.state.stories.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

  render() {
    return (
      <div id='zone' className='grid-container'>
        { this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
      </div>
    );
  }
}
