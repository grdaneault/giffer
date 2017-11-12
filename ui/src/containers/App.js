import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSubtitleQueryPage } from '../actions'
import SubtitleList from '../components/SubtitleList'
import SearchBox from "../components/SearchBox";
import PageSelector from "../components/PageSelector";


class App extends Component {
    static propTypes = {
        searchQuery: PropTypes.string.isRequired,
        searchPage: PropTypes.number.isRequired,
        results: PropTypes.array.isRequired,
        totalResults: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        isSearching: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { dispatch, searchQuery, searchPage } = this.props;
        dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchQuery !== this.props.searchQuery) {
            const { dispatch, searchQuery, searchPage } = nextProps;
            dispatch(fetchSearchResultsIfNecessary(searchQuery, searchPage))
        }
    }

    handleSearchChange = query => {
        this.props.dispatch(setSubtitleQuery(query));
    };

    handlePageChange = start => {
        const { dispatch, searchQuery } = this.props;
        dispatch(setSubtitleQueryPage(searchQuery, start));
        dispatch(fetchSearchResultsIfNecessary(searchQuery, start));
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
    const { searchQuery, searchPage, searchResultsByQuery } = state;
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

export default connect(mapStateToProps)(App)