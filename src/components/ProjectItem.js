import React, { Component, PropTypes } from 'react';
import Collapse from 'react-collapse';

// this component is used to create the accordian in /projects/page/{ zone_name }

export default class ProjectItem extends Component {
    static propTypes = {
      isOpened : PropTypes.bool,
      name: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number
    }

    componentWillMount() {
      const { isOpened } = this.props;
      this.setState({
        isOpened
      });
    }

    handleClick () {
      this.setState({ isOpened: !this.state.isOpened });
      console.log('handleClick called');
    }

    render () {
      const { isOpened, name, description, id } = this.props;
      return (
        <div
          className='project-item'
          onClick={ this.handleClick.bind(this) }
          >
          <h4>{ name }</h4>
          <Collapse isOpened={ this.state.isOpened }>
            <div
              className='project-description'
              dangerouslySetInnerHTML={{__html: description}}
              />
          </Collapse>
        </div>
      );
    }
}
