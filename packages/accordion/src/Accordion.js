import React, { Component } from "react";
import PropTypes from "prop-types";
import { cx, css } from "emotion";
import { ThemeContext } from "@hig/theme-context";
import { ControlBehavior } from "@hig/behaviors";

import {
  indicators,
  indicatorPositions,
  AVAILABLE_INDICATORS,
  AVAILABLE_INDICATOR_POSITIONS
} from "./constants";
import stylesheet from "./stylesheet";
import HeaderPresenter from "./presenters/HeaderPresenter";
import ContentPresenter from "./presenters/ContentPresenter";

export default class Accordion extends Component {
  static propTypes = {
    /** Text label for the accordion header */
    label: PropTypes.string.isRequired,
    /** Indicator icon */
    indicator: PropTypes.oneOf(AVAILABLE_INDICATORS),
    /** Indicator's position.
     * Note: When indicator is set to `indicators.CARET`,
     * indicator position will always be `indicatorPositions.LEFT` */
    indicatorPosition: PropTypes.oneOf(AVAILABLE_INDICATOR_POSITIONS),
    /** Function to modify the component's styles */
    stylesheet: PropTypes.func,
    /** Controlled value, specifies whether the accordion is collapsed or not
     * When provided, it overrides the accordion's collapsed state
     */
    collapsed: PropTypes.bool,
    /** Specifies whether the accordion is default collapsed or not */
    defaultCollapsed: PropTypes.bool,
    /** Specifies whether the accordion is disabled or not */
    disabled: PropTypes.bool,
    /** Content of the accordion */
    children: PropTypes.node,
    /** Function called when clicks the accordion's header */
    onClick: PropTypes.func
  };

  static defaultProps = {
    indicator: indicators.CARET,
    indicatorPosition: indicatorPositions.LEFT,
    defaultCollapsed: true,
    disabled: false,
    onClick: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: this.props.defaultCollapsed
    };
  }

  onClick = () => {
    if (!this.isCollapsedControlled()) {
      const { collapsed } = this.state;
      this.setState({ collapsed: !collapsed });
    }
    this.props.onClick(this.isCollapsed());
  };

  isCollapsedControlled = () => this.props.collapsed !== undefined;

  isCollapsed = () =>
    this.isCollapsedControlled() ? this.props.collapsed : this.state.collapsed;

  render() {
    const {
      children,
      label,
      indicator,
      indicatorPosition,
      disabled,
      stylesheet: customStylesheet,
      ...otherProps
    } = this.props;

    const {
      className,
      onBlur,
      onFocus,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      onHover
    } = otherProps;

    const effectiveIndicatorPosition =
      indicator === indicators.OPERATOR
        ? indicatorPosition
        : indicatorPositions.LEFT;

    const collapsed = this.isCollapsed();

    return (
      <ThemeContext.Consumer>
        {({ resolvedRoles, metadata }) => {
          const styles = stylesheet(
            {
              indicator,
              indicatorPosition: effectiveIndicatorPosition,
              collapsed,
              stylesheet: customStylesheet
            },
            resolvedRoles,
            metadata
          );

          return (
            <div className={cx(css(styles.wrapper), className)}>
              <ControlBehavior
                onBlur={onBlur}
                onFocus={onFocus}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
              >
                {({
                  hasFocus,
                  hasHover,
                  isPressed,
                  onBlur: handleBlur,
                  onFocus: handleFocus,
                  onMouseDown: handleMouseDown,
                  onMouseEnter: handleMouseEnter,
                  onMouseLeave: handleMouseLeave,
                  onMouseUp: handleMouseUp
                }) => (
                  <HeaderPresenter
                    {...otherProps}
                    hasFocus={hasFocus}
                    hasHover={hasHover}
                    isPressed={isPressed}
                    onBlur={handleBlur}
                    onClick={this.onClick}
                    onFocus={handleFocus}
                    onHover={onHover}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    stylesheet={customStylesheet}
                    label={label}
                    indicator={indicator}
                    indicatorPosition={effectiveIndicatorPosition}
                    collapsed={collapsed}
                    disabled={disabled}
                  />
                )}
              </ControlBehavior>
              <ContentPresenter
                collapsed={collapsed}
                stylesheet={customStylesheet}
                className={className}
              >
                {children}
              </ContentPresenter>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
