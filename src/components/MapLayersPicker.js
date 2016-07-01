import React, { PropTypes } from 'react';

export default class MapLayersPicker extends React.Component {

	static propTypes = {
		title: PropTypes.string,
		layers: PropTypes.array.isRequired,
		onLayerChange: PropTypes.func
	};

	static defaultProps = {
		title: 'Map Layers'
	};

	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="map-layers-picker">
				<div className="map-layers-picker-section">
					<div className="map-layers-picker-header">{ this.props.title }</div>
					{ this.props.layers.map(layer => this.renderCheckbox(layer.key, layer.name, layer.checked)) }
				</div>
			</div>
		);
	}

	handleChange (key, checked) {
		if (this.props.onLayerChange) {
			this.props.onLayerChange(key, checked);
		}
	}

	renderCheckbox (key, name, checked) {
		return (
			<div className="map-layers-picker-checkbox" key={ key }>
				<input
					type="checkbox"
					id={ key }
					onChange={ e => this.handleChange(key, e.target.checked) }
					checked={ checked }
				/>
				<label htmlFor={ key }>{ name }</label>
			</div>
		);
	}
}
