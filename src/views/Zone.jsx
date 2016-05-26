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

  componentWillMount () {
    if (!this.props.store.getState().projects.data.items.length) {
      this.props.actions.fetchProjectsData();
    }
    let urlMode = this.props.params.mode;
    let appMode = this.props.store.getState().mode;
    if (urlMode !== appMode) {
      this.props.actions.modeChanged(urlMode);
    }
    this.onStateChange();
  }

  componentDidMount () {
    // 
  }

  componentWillUpdate(nextProps, nextState) {
    const urlMode = nextProps.params.mode;
    const appMode = nextProps.store.getState().mode;
    // console.log(urlMode, appMode);
    const zoneTitle = this.props.params.zone;
    if (urlMode !== appMode) {
      this.updateModeUrl(appMode, zoneTitle);
    }
    if (nextState.projects !== this.state.projects) {
      console.log('we got projects now');
      // this.filterProjects(nextState.projects.data.items);
    }
  }

  componentDidUpdate () {
    //
  }

  componentWillUnmount () {
    this.unsubscribeStateChange();
  }

  onStateChange () {
    let storeState = this.props.store.getState();
    this.setState(storeState);
  }

  updateModeUrl (mode, zoneTitle) {
    this.props.history.push(`/projects/${mode}/${zoneTitle}`);
  }

  mapProjectZone(BGWZone) {
    if (BGWZone === 'Hunters Point Naval Shipyard/Candlestick') {
      return 'shipyard_candlestick';
    } else if (BGWZone === "India Basin") {
      return 'india_basin';
    } else if (BGWZone === "Pier 70/Central Waterfront") {
      return 'pier_70';
    } else if (BGWZone === "Mission Bay/Mission Rock") {
      return 'mission_bay_mission_rock';
    } else {
      return null;
    }
  }

  filterProjects (projectItems) {
    let filtered = projectItems.filter(project => {
      return this.mapProjectZone(project.BGWZone) === this.state.params.zone;
    });
    console.log(filtered);
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
      <div className='grid-container'>
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
			</div>
		);
	}

  render() {
    return (
      <div id='zone'>
        { this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
      </div>
    );
  }
}
