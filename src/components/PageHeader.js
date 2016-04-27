import React from 'react';

/**
 * Image + text block at top of each page
 */
export default class PageHeader extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		//

	}

	componentDidMount () {

		//

	}

	componentWillUnmount () {

		//

	}

	componentDidUpdate () {

		//

	}

	render () {

		return (
			<div className='page-header row'>
				<div className='header-cell'>
					<div className="header-shade">
						<div className='nine columns'>
							<h1>Discover the Blue Greenway</h1>
							<p>Imagine a network of parks, trails, beaches, and bay access points along 13 miles of San Francisco's southeastern waterfront.</p>
						</div>
					</div>
				</div>
			</div>
		);

	}

}
