import _ from 'underscore';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSearchPage } from '../actions/Search'
import PageSelector from "../components/PageSelector";
import { CircularProgress, List, TextField} from "material-ui";
import Subtitle from "../components/SubtitleListItem";


class SearchPage extends Component {
    static propTypes = {
        search: PropTypes.object.isRequired,

        // Injected by React Router
        children: PropTypes.node,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired

    };

    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
        this.handleSearchChange = _.debounce(this.handleSearchChange, 200);
    }


    delayedHandleSearchChange(query) {
        this.setState({
            query: query
        });
        this.handleSearchChange(query);
    }

    componentDidMount() {
        const { dispatch, match } = this.props;
        if (match && match.params.searchQuery) {
            dispatch(setSubtitleQuery(match.params.searchQuery));
            this.setState({
                query: match.params.searchQuery
            });
        }

        if (match && match.params.page) {
            dispatch(setSearchPage(match.params.page));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.search.get('query') !== this.props.search.get('query') || nextProps.search.get('start') !== this.props.search.get('start')) {
            const { dispatch, search } = nextProps;
            dispatch(fetchSearchResultsIfNecessary(search.get('query'), search.get('start')));

            this.setState({
                query: nextProps.search.get('query')
            })
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
        return (
            <div>
                <div>
                    <TextField
                        id="full-width"
                        label="Search"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Placeholder"
                        helperText="Search for your favorite movie quotes!"
                        fullWidth
                        margin="normal"
                        onChange={(e) => this.delayedHandleSearchChange(e.target.value)}
                        value={this.state.query} />
                    { !search.get('loading') && <PageSelector page={page} pages={pages} onChange={this.handlePageChange}/> }
                </div>
                <div>
                    { isEmpty ?
                        search.get('loading') ?
                            <h2>
                                Loading...
                                <CircularProgress size={50} />
                            </h2> :
                            <h2>
                                No results...
                                {search.get('error')}
                            </h2>
                        :
                        <List>
                            {
                                search.get('results').map((subtitle, i) =>
                                    <Subtitle subtitle={subtitle} />
                                )
                            }
                        </List>
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