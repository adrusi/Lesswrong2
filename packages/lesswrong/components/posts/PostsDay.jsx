import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  dayTitle: {
    marginTop: theme.spacing.unit*2,
    marginBottom: theme.spacing.unit
  }
})

class PostsDay extends PureComponent {

  render() {
    const { date, posts, classes } = this.props;
    const noPosts = posts.length === 0;

    return (
      <div className="posts-day">
        <Typography variant="title" className={classes.dayTitle} >{date.format('dddd, MMMM Do YYYY')}</Typography>
        { noPosts ? <Components.PostsNoMore /> :
          <div className="posts-list">
            <div className="posts-list-content">
              {posts.map((post, index) => <Components.PostsItem post={post} key={post._id} index={index} currentUser={this.props.currentUser} />)}
            </div>
          </div>
        }
      </div>
    );
  }
}

PostsDay.propTypes = {
  currentUser: PropTypes.object,
  date: PropTypes.object,
  number: PropTypes.number
};

replaceComponent('PostsDay', PostsDay, withStyles(styles));
