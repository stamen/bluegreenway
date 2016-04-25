import * as React from 'react';

export default class Dropdown extends React.Component {

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

	handleChange (e) {
		if (this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}

	render () {
		return (
			<select className="filter-dropdown" onChange={e => this.handleChange(e)}>
				<option>{this.props.placeholder}</option>
				{this.renderOptions()}
			</select>
		);
	}

	renderOptions () {
		return this.props.options.map((option, i) => {
			return (
				<option value={option.value} key={option.value}>
					{option.display}
				</option>
		    );
		});
	}

}
