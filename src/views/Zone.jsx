import React, { Component } from 'react';
import moment from 'moment';

import ProjectItem from '../components/ProjectItem';
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

  renderProjectItems (projects) {
    projects = projects.filter(project => {
      return this.mapProjectZone(project.BGWZone) === this.props.params.zone;
    });

    let projectListItems = [];

    if (projects.length) {
      projectListItems = projects.map(project => {
        return (
          <ProjectItem
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            isOpened={false}
            />
        );
      });
    }

    return (
      <div className='project-list-items'>
        { projectListItems }
      </div>
    );
  }

  renderOpenSpacesItems () {
    // renders the list of open spaces for the given zone from???
    // potentially can also use the same logic from renderProjectItems &
    // the <ProjectItem> component, so this method may not be necessary...
  }

  renderPageView () {
    let zoneTitle = this.props.params.zone.split('_').join(' ');
    const about = `Some placeholder text about ${zoneTitle}....`;

    return (
      <div className='grid-container'>
        <div className='accordian-wrapper row'>
          <div className='title-container'>
            <div className='six columns'>
              <h2 className='title'>{ zoneTitle }</h2>
              <p>{ about }</p>
              <button>View on Map</button>
            </div>
            <div
              className='six columns'
              style={{backgroundImage:'url("img/zone-placeholder.jpg")'}}
              />
          </div>
          <div className='projects-list'>
            <h4 className='section-title'>Projects</h4>
            { this.state.projects.data.items.length?
              this.renderProjectItems(this.state.projects.data.items) :
              <div className='loading'><p>loading projects...</p></div> }
          </div>
          <div className='open-spaces-list'>
            <h4 className='section-title'>Open Spaces</h4>
            { /* this.renderOpenSpacesItems() */ }
            <div className='loading'><p>open spaces info coming soon!</p></div>
          </div>
        </div>
      </div>
    );
  }

  renderMapView () {
		return (
			<div className='stories-map-overlay'>
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
