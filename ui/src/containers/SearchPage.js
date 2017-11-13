import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSubtitleQueryPage } from '../actions/Search'
import SubtitleList from '../components/SubtitleList'
import SearchBox from "../components/SearchBox";
import PageSelector from "../components/PageSelector";


class SearchPage extends Component {
    static propTypes = {
        searchQuery: PropTypes.string.isRequired,
        searchPage: PropTypes.number.isRequired,
        results: PropTypes.array.isRequired,
        totalResults: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        isSearching: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired,

        // Injected by React Router
        children: PropTypes.node,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired

    };

    componentDidMount() {
        const { dispatch, searchQuery, searchPage, size, match } = this.props;
        console.log("MATCH", match);
        if (match && match.params.searchQuery) {
            dispatch(setSubtitleQuery(match.params.searchQuery));
        }

        if (match && match.params.start) {
            console.log("page", match.params.start / size)
            dispatch(setSubtitleQueryPage(searchQuery, match.params.start / size, size));
        }

        dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage * size))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchQuery !== this.props.searchQuery) {
            const { dispatch, searchQuery, searchPage, size } = nextProps;
            dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage * size))
        }
    }

    handleSearchChange = query => {
        this.props.dispatch(setSubtitleQuery(query));
        this.props.history.push(`/search/${query}`);
    };

    handlePageChange = start => {
        const { dispatch, searchQuery, size } = this.props;
        dispatch(setSubtitleQueryPage(searchQuery, start, size));
        dispatch(fetchSearchResultsIfNecessary(searchQuery, start * size));
        this.props.history.push(`/search/${searchQuery}/${start * size}`);
    };


    render() {
        const { searchQuery, results, totalResults, size, searchPage, isSearching } = this.props;
        const isEmpty = results.length === 0;
        const page = searchPage / size;
        const pages = Math.ceil(totalResults / size);
        console.log("start", searchPage, "total", totalResults, "size", size);
        return (
            <div>
                <div>
                    <SearchBox onChange={this.handleSearchChange} value={searchQuery} />
                    { !isSearching && <PageSelector page={page} pages={pages} onChange={this.handlePageChange}/> }
                </div>
                <div>
                    { isEmpty
                        ? isSearching ? <h2>Loading...</h2> : <h2>No results...</h2>
                        : <SubtitleList subtitles={results}/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { searchQuery, searchPage, searchResultsByQuery, match } = state;
    const {
        isSearching,
        results,
        total: totalResults,
    } = searchResultsByQuery[searchQuery] || {
        isSearching: true,
        results: [],
        total: 0,
        size: 20
    };

    const size = 20;

    console.log(searchQuery, searchPage);

    return {
        searchQuery,
        searchPage,
        results,
        totalResults,
        isSearching,
        size
    };
};

export default withRouter(connect(mapStateToProps)(SearchPage));