/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import PropTypes from 'prop-types';
import { Spinner } from 'primereact/components/spinner/Spinner';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { connect } from 'react-redux';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import ErrorMessage from '../shared/errorMessage';
import { post } from '../../utilities/secureHTTP';

const MINIMUM_SNOOZE_TIME = 0;
const MAXIMUM_SNOOZE_TIME = 60;

class NotificationSettings extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    header: PropTypes.object,
    snoozeTime: PropTypes.number.isRequired,
    isLedBlinkingEnabled: PropTypes.bool.isRequired,
    isVibrationEnabled: PropTypes.bool.isRequired,
    changeSnoozeTime: PropTypes.func.isRequired,
    changeIsLedBlinkingEnabled: PropTypes.func.isRequired,
    changeIsVibrationEnabled: PropTypes.func.isRequired,
    hasErrors: PropTypes.bool.isRequired,
  }

  enableLedBlinking() {
    this.props.changeIsLedBlinkingEnabled(!this.props.isLedBlinkingEnabled);
    post(`${URL}notificationSettings`, {
      isLedBlinkingEnabled: this.props.isLedBlinkingEnabled,
    });
  }

  enableVibration() {
    this.props.changeIsVibrationEnabled(!this.props.isVibrationEnabled);
    post(`${URL}notificationSettings`, {
      isVibrationEnabled: this.props.isVibrationEnabled,
    });
  }

  changeSnoozeTime(snoozeTime) {
    if (!snoozeTime || !parseInt(snoozeTime)) {
      return;
    }
    this.props.changeSnoozeTime(parseInt(snoozeTime, 10));
    // TODO: This shouldn't be done here. However, the onBlur event doesn't seem to trigger
    // and we have to do it here for the snooze notification to be sent.
    post(`${URL}notificationSettings`, {
      snoozeTime: this.props.snoozeTime,
    });
  }

  saveSnoozeTime() {
    post(`${URL}notificationSettings`, {
      snoozeTime: this.props.snoozeTime,
    });
  }

  render() {
    if (this.props.hasErrors) {
      return <ErrorMessage />;
    }
    return (
      <div>
        <div>
          <Checkbox
            id="enableLedBlinking"
            onChange={() => this.enableLedBlinking()}
            checked={this.props.isLedBlinkingEnabled}
          />
          <label htmlFor="enableLedBlinking">
            {T.translate(`settings.notification.enableLedBlinking.${this.props.language}`)}
          </label>
        </div>
        <div>
          <Checkbox
            id="enableVibration"
            onChange={() => this.enableVibration()}
            checked={this.props.isVibrationEnabled}
          />
          <label htmlFor="enableVibration">
            {T.translate(`settings.notification.enableVibration.${this.props.language}`)}
          </label>
        </div>
        <div>
          <span>
            <i id="snoozeTimeToolTip" className="fa fa-info-circle" />
            &nbsp;
            {T.translate(`settings.notification.snoozeTime.${this.props.language}`)}
            :&nbsp;&nbsp;
          </span>
          <Tooltip
            for="#snoozeTimeToolTip"
            title={T.translate(`settings.notification.snoozeTimeToolTip.${this.props.language}`)}
          />
          <Spinner
            id="value"
            type="number"
            onChange={event => this.changeSnoozeTime(event.value)}
            onBlur={this.saveSnoozeTime}
            value={this.props.snoozeTime}
            min={MINIMUM_SNOOZE_TIME}
            max={MAXIMUM_SNOOZE_TIME}
            maxlength={2}
            size="3"
          />
          <span>
            &nbsp;&nbsp;
            {T.translate(`time.minutes.${this.props.language}`)}
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    header: state.applicationReducer.header,
  };
}

export default connect(mapStateToProps)(NotificationSettings);
