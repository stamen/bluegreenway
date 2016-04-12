import * as React from 'react';

/**
 * An extremely minimal component,
 * designed as boilerplate for new components
 * and to demonstrate data flow through a React+Redux application.
 */
export default class ExampleComponent extends React.Component {

	static propTypes = {
		inited: React.PropTypes.bool,
		count: React.PropTypes.number
	};

	static defaultProps = {
		inited: false,
		count: 0,
	};

	constructor (props) {

		super(props);

	}

	setUpReduxExample () {

		// example of state manipulation and communication across components
		document.addEventListener('click', (event) => {

			if (event.pageX > 0.5 * window.innerWidth) {
				this.props.actions.exampleComponentIncrement();
			} else {
				this.props.actions.exampleComponentDecrement();
			}

		});

	}

	componentWillMount () {

		//

	}

	componentDidMount () {

		this.setUpReduxExample();

	}

	componentWillUnmount () {

		//

	}

	componentDidUpdate () {

		//

	}

	render () {

		return (
			<div className='example-component'>
				<h2>ExampleComponent</h2>
				<p>Component inited:<span className={ this.props.inited ? 'ready' : 'not-ready' }>{ this.props.inited.toString() }</span></p>
				<p>Click count: { this.props.count }</p>
			</div>
		);

	}

}
