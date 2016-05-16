import React, { Component } from 'react';

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
    var urlMode = nextProps.params.mode;
    var appMode = nextProps.store.getState().mode;
    if (urlMode !== appMode) {
      this.updateModeUrl(appMode);
    }
  }

  updateModeUrl (mode) {
    this.props.history.push(`/projects/${mode}`);
  }

  componentWillMount () {
    var urlMode = this.props.params.mode;
    if (urlMode) {
      this.props.actions.modeChanged(urlMode);
    }
    this.onStateChange();

    if (!this.props.store.getState().projects.data.items.length) {
      this.props.actions.fetchProjectsData();
    }
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

  render() {
    return (
      <div id='#zone'></div>
    );
  }
}
