import * as React from 'react';

import PageHeader from '../components/PageHeader';

export default class Stories extends React.Component {

	constructor (props) {
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
		this.props.history.push(`/stories/${mode}`);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
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

	render () {

		return (
			<div>
				{ this.state.mode === 'page' ?
					<div id='stories' className="grid-container">
						<PageHeader />
						<h1>STORIES</h1>
					</div>
					: null
				}
			</div>
		);

	}

}
