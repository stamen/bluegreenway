import * as React from 'react';

export default class MapLayersPicker extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	render () {
		return (
			<div className="map-layers-picker">
				<div className="map-layers-picker-section">
					<div className="map-layers-picker-header">
						Map Layers
					</div>
					{this.props.layers.map(layer => this.renderCheckbox(layer.key, layer.name, 'layers', layer.checked))}
				</div>
				<div className="map-layers-picker-section">
					<div className="map-layers-picker-header">
						Transportation
					</div>
					{this.props.transportation.map(layer => this.renderCheckbox(layer.key, layer.name, 'transportation'))}
				</div>
			</div>
		);
	}

	handleChange (key, group, checked) {
		if (group === 'layers') {
			this.props.onLayerChange(key, checked);
		}
		if (group === 'transportation') {
			this.props.onTransportationChange(key, checked);
		}
	}

	renderCheckbox (key, name, group, checked) {
		return (
			<div className="map-layers-picker-checkbox" key={key}>
				<input type="checkbox" id={key} onChange={e => this.handleChange(key, group, e.target.checked)} checked={checked} />
				<label htmlFor={key}>{name}</label>
			</div>
		);
	}
}
