import React, { PropTypes } from 'react';
import Modal from 'react-modal';

/**
 * Modal with message and optional login/signup button
 */
export default class BrochureModal extends React.Component {

	static propTypes = {
		isOpen: PropTypes.bool,
		onClose: PropTypes.func
	}

	static defaultProps = {
		onClose: () => {}
	}

	constructor (props) {

		super(props);
		this.state = {};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.closeModal = this.closeModal.bind(this);

	}

	componentWillReceiveProps (nextProps) {

		if (nextProps.isOpen === true) {
			window.addEventListener('keydown', this.onKeyDown);
			// TODO: add modal overlay click handler to close
		} else if (nextProps.isOpen === false) {
			window.removeEventListener('keydown', this.onKeyDown);
			// TODO: remove modal overlay click handler to close
		}

		// NOTE: while `isOpen` is controlled by parent component for opening the modal,
		// it is transformed into local state here so that the modal has control over closing itself
		// and triggering the onRequestClose callback.
		// However, current state is preserved when the modal is remaining open.
		if (!nextProps.isOpen || !this.state.isOpen) {
			this.setState({
				isOpen: nextProps.isOpen
			});
		}

	}

	componentDidUpdate () {

		if (this.overlayClickHandlerInited || !this.state.isOpen) return;

		// Give modal overlay time to open
		setTimeout(() => {
			let overlay = document.querySelector('.brochure-modal-overlay');
			if (!overlay) return;

			overlay.addEventListener('click', () => this.closeModal(false));
			this.overlayClickHandlerInited = true;
		}, 100);

	}

	onKeyDown (event) {

		switch (event.keyCode) {
			case 27:	// escape
				this.closeModal(false);
				break;
		}

	}

	closeModal (confirmed) {

		this.props.onClose && this.props.onClose(confirmed);

	}

	render () {

		const {
			title,
			message
		} = this.props;

		let iframeStyle = {
			width: '100%',
			height: '100%'
		};

		return (
			<Modal
				isOpen={ this.state.isOpen }
				className='brochure-modal'
				overlayClassName='brochure-modal-overlay'
			>
				<iframe src="http://docs.google.com/gview?url=http://www.sfparksalliance.org/sites/default/files/bgway_map.pdf&embedded=true" style={ iframeStyle } frameborder="0"></iframe>
			</Modal>
		);
	}

}
