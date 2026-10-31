import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { deleteNotification, fetchNotifications } from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import withTags from 'Tags/withTags';
import sortByProp from 'Utilities/Array/sortByProp';
import Notifications from './Notifications';

function createMapStateToProps() {
  return createSelector(
    createSortedSectionSelector('settings.notifications', sortByProp('name')),
    (notifications) => {
      return {
        ...notifications
      };
    }
  );
}

const mapDispatchToProps = {
  fetchNotifications,
  deleteNotification
};

class NotificationsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchNotifications();
  }

  //
  // Listeners

  onConfirmDeleteNotification = (id) => {
    this.props.deleteNotification({ id });
  };

  //
  // Render

  render() {
    return (
      <Notifications
        {...this.props}
        onConfirmDeleteNotification={this.onConfirmDeleteNotification}
      />
    );
  }
}

NotificationsConnector.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired
};

export default withTags(connect(createMapStateToProps, mapDispatchToProps)(NotificationsConnector));
