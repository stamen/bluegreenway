import * as React from 'react';
import PageHeader from '../components/PageHeader';

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
