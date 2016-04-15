import * as React from 'react';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import PageHeader from '../components/PageHeader';

// main app container
export default class Home extends React.Component {

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
			<div id='home' className="grid-container">

				<PageHeader />

				<div className='row'>
					<div className='three columns'></div>
					<div className='six columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='six columns'></div>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='three columns'></div>
					<div className='six columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='six columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='six columns'></div>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

			</div>
		);

	}

}
