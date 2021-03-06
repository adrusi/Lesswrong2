import React, { Component } from 'react';
import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import PropTypes from 'prop-types';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Configure,
  Index } from 'react-instantsearch/dom';
import FontIcon from 'material-ui/FontIcon';

const closeIconStyle = {
  fontSize: '14px',
}

const searchIconStyle = {
  position: 'absolute',
  padding: '12px',
}

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      inputOpen: false,
      searchOpen: false,
      currentQuery: "",
    }
  }

  openSearchInput = () => {
    this.setState({inputOpen: true});
  }

  closeSearchInput = () => {
    this.setState({inputOpen: false});
  }

  openSearchResults = () => {
    this.setState({searchOpen: true});
  }

  closeSearchResults = () => {
    this.setState({searchOpen: false});
  }

  closeSearch = () => {
    this.setState({searchOpen: false, inputOpen: false});
  }

  handleSearchTap = () => {
    this.setState({inputOpen: true, searchOpen: this.state.currentQuery});
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') this.closeSearch();
  }

  queryStateControl = (searchState) => {
    this.setState({currentQuery: searchState.query});
    if (searchState.query) {
      this.openSearchResults();
    } else {
      this.closeSearchResults();
    }
  }

  render() {
    const inputOpenClass = this.state.inputOpen ? "open" : null;
    const resultsOpenClass = this.state.searchOpen ? "open" : null;
    const algoliaAppId = getSetting('algolia.appId')
    const algoliaSearchKey = getSetting('algolia.searchKey')

    if(!algoliaAppId) {
      return <div className="search-bar">Search is disabled (Algolia App ID not configured on server)</div>
    }

    searchIconStyle.color = this.props.color;
    closeIconStyle.color = this.props.color;

    return <div className="search">
      <Components.ErrorBoundary>
        <InstantSearch
          indexName="test_posts"
          appId={algoliaAppId}
          apiKey={algoliaSearchKey}
          onSearchStateChange={this.queryStateControl}
        >
          <div className={"search-bar " + inputOpenClass} onKeyDown={this.handleKeyDown}>
            <div onClick={this.handleSearchTap}>
              <FontIcon className="material-icons" style={searchIconStyle}>search</FontIcon>
              <SearchBox resetComponent={<div className="search-box-reset"></div>} focusShortcuts={[]} />
            </div>
            <div className="search-bar-close" onClick={this.closeSearch}>
              <FontIcon className="material-icons" style={closeIconStyle}>close</FontIcon>
            </div>
          </div>
          <div className={"search-results " + resultsOpenClass}>
            <div className="search-results-container">
              <div className="search-results-container-left">
                <div className="search-results-posts">
                  <Index indexName="test_posts">
                    <Configure hitsPerPage={3} />
                    <Components.Section title="Posts" titleWidth={150} titleComponent={<Pagination pagesPadding={0} showFirst={false}/>}>
                      <div className="search-results-posts-content">
                        <Hits hitComponent={(props) => <Components.PostsSearchHit clickAction={this.closeSearch} {...props} />} />
                      </div>
                    </Components.Section>
                  </Index>
                </div>
                <div className="search-results-comments">
                  <Index indexName="test_comments">
                    <Configure hitsPerPage={3} />
                    <Components.Section title="Comments" titleWidth={150} titleComponent={<Pagination pagesPadding={0} showFirst={false}/>}>
                      <div className="search-results-comments-content">
                        <Hits hitComponent={(props) => <Components.CommentsSearchHit clickAction={this.closeSearch} {...props} />} />
                      </div>
                    </Components.Section>
                  </Index>
                </div>
              </div>
              <div className="search-results-container-right">
                <div className="search-results-users">
                  <Index indexName= "test_users">
                    <Configure hitsPerPage={10} />
                    <div className="search-results-users-heading">
                      <h2>Users</h2>
                    </div>
                    <div className="search-results-users-content" >
                      <Hits hitComponent={(props) => <Components.UsersSearchHit clickAction={this.closeSearch} {...props} />} />
                    </div>
                  </Index>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
      </Components.ErrorBoundary>
    </div>
  }
}

SearchBar.propTypes = {
  color: PropTypes.string,
};

SearchBar.defaultProps = {
  color: "rgba(0, 0, 0, 0.6)"
}

registerComponent("SearchBar", SearchBar);

//
// const Search = () =>
//
//
// const Post = (props) =>
//   <div>
//     <hr />
//     <span className="hit-title">
//       <Highlight attributeName="title" hit={props.hit} />
//     </span>
//     <br />
//     <span className="hit-htmlBody">
//       <Snippet attributeName="htmlBody" hit={props.hit} />
//     </span>
//   </div>
