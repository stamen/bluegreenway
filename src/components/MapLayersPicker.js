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
			<div className='map-layers-picker'>
				<div className='map-layers-picker-section'>
					<div className='map-layers-picker-header'>{ this.props.title }</div>
					{ this.props.layers.map(layer => this.renderCheckbox(layer)) }
				</div>
			</div>
		);
	}

	handleChange (key, checked) {
		console.log({ key, checked });
		if (this.props.onLayerChange) {
			this.props.onLayerChange(key, checked);
		}
	}

	renderCheckbox (config) {
		let {
			key,
			name,
			icon,
			iconSize,
			iconType,
			checked
		} = config;
		iconType = iconType || '';

		return (
			<div className='map-layers-picker-checkbox' key={ key }>
				{ icon ? 
					<svg
						width={ iconSize[0] }
						height={ iconSize[1] }
						className={ `${ iconType } ${ key } ${ checked ? '' : 'off' }` }
						onClick={ e => this.handleChange(key, !checked) }
					>
						<use xlinkHref={ '#' + icon } />
					</svg>
				: null }
				<input
					className={ icon ? 'hidden' : '' }
					type='checkbox'
					id={ key }
					onChange={ e => this.handleChange(key, e.target.checked) }
					checked={ checked }
				/>
				<label htmlFor={ key } className={ iconType }>{ name }</label>
			</div>
		);
	}
}
