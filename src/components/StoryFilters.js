import * as React from 'react';

import Dropdown from 'react-dropdown';

export default class StoryFilters extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      filterCategory: ''
    });
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }

  filterCategories() {
    // to do: call an action to filter the categories
    // update the redux store
  }

  handleCategoryChange(category) {
    this.setState({ filterCategory: category });
  }

  render() {
    return (
      <div className='filter-container'>
        <Dropdown
          placeholder={this.state.filterCategory ? this.state.filterCategory.label : 'Category'}
          onChange={category => this.handleCategoryChange(category)}
          options={this.props.categoryOptions}
          value={this.state.filterCategory} />
        <button className='filter-button' onClick={this.filterCategories.bind(this)}>
          search
        </button>
      </div>
    );
  }
}
