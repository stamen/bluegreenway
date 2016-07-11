import React, { PropTypes } from 'react';
import slug from 'slug';

export default class MapPOILegend extends React.Component {

	constructor (props) {
		super(props);
	}

	render () {
		let pois = [
			{ 
				icon: 'icon_bench',
				iconSize: [30, 20],
				label: 'benches'
			},
			{ 
				icon: 'icon_picnic-table',
				iconSize: [30, 20],
				label: 'picnic tables'
			},
			{ 
				icon: 'icon_boat-launch',
				iconSize: [30, 20],
				label: 'boat launch - existing'
			},
			{ 
				icon: 'icon_boat-launch',
				iconSize: [30, 20],
				label: 'boat launch - planned'
			}
		];

		return (
			<div className='map-poi-legend'>
				{ pois.map(poi =>
					<div key={ poi.label }>
						<svg
							width={ poi.iconSize[0] }
							height={ poi.iconSize[1] }
							className={ slug(poi.label) }
						>
							<use xlinkHref={ '#' + poi.icon } />
						</svg>
						<div className='label'>{ poi.label }</div>
					</div>
				)}
			</div>
		);
	}

}
