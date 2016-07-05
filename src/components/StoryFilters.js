import React, { PropTypes } from 'react';
import Dropdown from 'react-dropdown';

export default class StoryFilters extends React.Component {
	static propTypes = {
		filterCategory: PropTypes.array,
		onFilterChange: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.applyFilters = this.applyFilters.bind(this);
	}

	componentWillMount () {
		this.setState({
			filterCategory: ''
		});
	}

	applyFilters () {
		if (this.props.onFilterChange) {
			this.props.onFilterChange(this.state);
		}
	}

	handleCategoryChange (category) {
		this.setState({ filterCategory: category });
	}

	render () {
		return (
			<div className='filter-container'>
				<Dropdown
					placeholder={ this.state.filterCategory ? this.state.filterCategory.label : 'Category' }
					onChange={ category => this.handleCategoryChange(category) }
					options={ this.props.categoryOptions }
					value={ this.state.filterCategory }
				/>
				<button className='filter-button' onClick={ this.applyFilters }>
					search
				</button>
			</div>
		);
	}
}
