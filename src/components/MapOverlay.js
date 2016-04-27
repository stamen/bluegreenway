import * as React from 'react';

import Collapse from 'react-collapse';

export default class MapOverlay extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.setState({
			expanded: true
		});
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	handleCollapseToggleClick () {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	renderToggle () {
		if (this.props.collapsible) {
			return (
				<span className={"collapse-toggle" + (this.state.expanded ? ' expanded' : ' collapsed')} onClick={this.handleCollapseToggleClick.bind(this)}></span>
			);
		}
		return null;
	}

	render () {
		return (
			<div className="map-overlay collapse">
				{this.renderToggle()}
				<Collapse isOpened={this.state.expanded}>
					{this.props.children}
				</Collapse>
			</div>
		);
	}

}
