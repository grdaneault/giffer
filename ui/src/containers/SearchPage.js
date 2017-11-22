import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSearchPage } from '../actions/Search'
import SubtitleList from '../components/SubtitleList'
import SearchBox from "../components/SearchBox";
import PageSelector from "../components/PageSelector";


class SearchPage extends Component {
    static propTypes = {
        search: PropTypes.object.isRequired,

        // Injected by React Router
        children: PropTypes.node,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired

    };

    componentDidMount() {
        const { dispatch, match } = this.props;
        if (match && match.params.searchQuery) {
            dispatch(setSubtitleQuery(match.params.searchQuery));
        }

        if (match && match.params.page) {
            dispatch(setSearchPage(match.params.page));
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("NEXT PROPS", nextProps);
        if (nextProps.search.get('query') !== this.props.search.get('query') || nextProps.search.get('start') !== this.props.search.get('start')) {
            const { dispatch, search } = nextProps;
            console.log('dispatching search for ', search.get('query'));
            dispatch(fetchSearchResultsIfNecessary(search.get('query'), search.get('start')))
        }
    }

    handleSearchChange = query => {
        this.props.dispatch(setSubtitleQuery(query));
        this.props.history.push(`/search/${query}`);
    };

    handlePageChange = page => {
        const { dispatch, search } = this.props;
        dispatch(setSearchPage(page));
        this.props.history.push(`/search/${search.get('query')}/${page}`);
    };


    render() {
        const { search } = this.props;
        const isEmpty = search.get('totalResults') === 0;
        const page = search.get('page');
        const pages = Math.ceil(search.get('totalResults') / search.get('pageSize'));
        console.log("page", page, "of", pages);
        return (
            <div>
                <div>
                    <SearchBox onChange={this.handleSearchChange} value={search.get('query')} />
                    { !search.get('loading') && <PageSelector page={page} pages={pages} onChange={this.handlePageChange}/> }
                </div>
                <div>
                    { isEmpty
                        ? search.get('loading') ? <h2>Loading...</h2> : <h2>No results... {search.get('error')}</h2>
                        : <SubtitleList subtitles={search.get('results')}/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { search } = state;

    return {
        search
    };
};

export default withRouter(connect(mapStateToProps)(SearchPage));