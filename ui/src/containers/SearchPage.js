import _ from 'underscore';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fetchSearchResultsIfNecessary, setSubtitleQuery, setSearchPage } from '../actions/Search'
import PageSelector from "../components/PageSelector";
import { CircularProgress, List} from "material-ui";
import Subtitle from "../components/SubtitleListItem";


import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import AppSearch from "../components/SubtitleSearchBox";

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

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
        const nextQuery = nextProps.search.get('query');

        if (nextQuery !== this.props.search.get('query') || nextProps.search.get('start') !== this.props.search.get('start')) {
            const { dispatch, search } = nextProps;
            dispatch(fetchSearchResultsIfNecessary(nextQuery, search.get('start')));

            this.setState({
                query: nextQuery
            });
        }
    }

    handlePageChange = page => {
        const { dispatch, search } = this.props;
        dispatch(setSearchPage(page));
        this.props.history.push(`/search/${search.get('query')}/${page}`);
    };


    render() {
        const { search, classes } = this.props;
        const isEmpty = search.get('totalResults') === 0;
        const page = search.get('page');
        const totalResults = search.get('totalResults');
        const pageSize = search.get('pageSize');
        const pages = Math.ceil(totalResults / pageSize);

        return (
            <div>
                <div>
                    { !search.get('loading') && totalResults > 0 && <PageSelector
                        totalResults={totalResults}
                        pageSize={pageSize}
                        page={page}
                        pages={pages}
                        onChange={this.handlePageChange}/> }
                </div>
                <div>
                    { isEmpty ?
                        search.get('loading') ?
                            <h2>
                                <Typography type="title" color="inherit" className={classes.flex}>
                                    Loading...
                                </Typography>
                                <CircularProgress size={50} />
                            </h2> :
                            <h2>
                                <Typography type="title" color="inherit" className={classes.flex}>
                                    No Results... {search.get('error')}
                                </Typography>
                            </h2>
                        :
                        <List>
                            {
                                search.get('results').map((subtitle, i) =>
                                    <Subtitle subtitle={subtitle} key={i} />
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

export default withStyles(styles)(withRouter(connect(mapStateToProps)(SearchPage)));
