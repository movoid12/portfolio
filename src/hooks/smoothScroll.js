// Todo: Update update legacy code (contextAPI)
import PropTypes from "prop-types";
import React from "react";
import SmoothScrollbar from "smooth-scrollbar";

export const ScrollbarContext = React.createContext(null);

export default class Scrollbar extends React.Component {
	static propTypes = {
		damping: PropTypes.number,
		thumbMinSize: PropTypes.number,
		syncCallbacks: PropTypes.bool,
		renderByPixels: PropTypes.bool,
		alwaysShowTracks: PropTypes.bool,
		continuousScrolling: PropTypes.bool,
		wheelEventTarget: PropTypes.element,
		plugins: PropTypes.object,
		onScroll: PropTypes.func,
		children: PropTypes.node,
	}; // Todo: Find a better way to do this (to have PropTypes outside of the class)

	static childContextTypes = {
		getScrollbar: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.callbacks = [];
	}

	getChildContext() {
		return {
			getScrollbar: (cb) => {
				if (typeof cb !== "function") return;

				if (this.scrollbar) setTimeout(() => cb(this.scrollbar));
				else this.callbacks.push(cb);
			},
		};
	}

	componentDidMount() {
		this.scrollbar = SmoothScrollbar.init(this.$container, this.props);

		for (const cb of this.callbacks) {
			cb(this.scrollbar);
		}

		this.scrollbar.addListener(this.handleScroll.bind(this));
	}

	componentWillUnmount() {
		if (this.scrollbar) {
			this.scrollbar.destroy();
		}
	}

	componentDidUpdate(nextProps) {
		for (const key in nextProps) {
			if (!(key in this.scrollbar.options)) continue;

			if (key === "plugins") {
				// update plugin options
			} else {
				this.scrollbar.options[key] = nextProps[key];
			}
		}

		this.scrollbar.update();
	}

	handleScroll(status) {
		if (this.props.onScroll) {
			this.props.onScroll(status, this.scrollbar);
		} // Todo: Use object destructuring to get the status
	}

	render() {
		const {
			damping,
			thumbMinSize,
			syncCallbacks,
			renderByPixels,
			alwaysShowTracks,
			continuousScrolling,
			wheelEventTarget,
			plugins,

			onScroll,
			children,
			...others
		} = this.props;

		return (
			<section
				data-scrollbar
				// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				ref={(element) => (this.$container = element)}
				{...others}
			>
				<div>{children}</div>
			</section>
		);
	}
}
