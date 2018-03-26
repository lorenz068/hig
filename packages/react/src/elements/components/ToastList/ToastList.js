import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import FlipMove from "react-flip-move";
import "./toastList.scss";

const MAX_TOASTS_ONSCREEN = 3;

export default class ToastList extends React.Component {
  enterAnimation = () => ({
    from: {
      transform: `translateY(${
        this.props.position === "top" ? "-1in" : "1in"
      })`,
      opacity: 0.1
    },
    to: {
      transform: ""
    }
  });

  leaveAnimation = () => ({
    from: {
      transform: ""
    },
    to: {
      transform: `translateY(${
        this.props.position === "top" ? "-1in" : "1in"
      })`,
      opacity: 0.1
    }
  });

  render() {
    const toastListWrapperClasses = cx("hig__toast-list-wrapper", {
      [`hig__toast-list-wrapper--position-${this.props.position}`]: this.props
        .position
    });
    const toastListClasses = cx("hig__toast-list", {
      [`hig__toast-list--position-${this.props.position}`]: this.props.position
    });

    return (
      <div className={toastListWrapperClasses}>
        <FlipMove
          className={toastListClasses}
          duration={1000}
          easing="ease-out"
          // appearAnimation={this.enterAnimation()}
          enterAnimation={this.enterAnimation()}
          leaveAnimation={this.leaveAnimation()}
        >
          {this.props.children.slice(0, MAX_TOASTS_ONSCREEN)}
        </FlipMove>
      </div>
    );
  }
}

ToastList.propTypes = {
  /**
   * Whether to render the list of notifications at the top or bottom of the screen.
   * The list will be sorted such that the most recently added notification will
   *  appear closest to the page edge.
   */
  position: PropTypes.oneOf(["top", "bottom"]),
  /**
   * A list of Toast elements to render
   */
  children: PropTypes.node
};
