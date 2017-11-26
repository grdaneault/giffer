import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SearchWeb} from 'mdi-material-ui';
import {fade} from 'material-ui/styles/colorManipulator';
import {withStyles} from 'material-ui/styles';
import _ from 'underscore';
import {setSubtitleQuery} from "../actions/Search";
import {connect} from "react-redux";

const styles = theme => ({
    '@global': {
        '.algolia-autocomplete': {
            fontFamily: theme.typography.fontFamily,
            '& .algolia-docsearch-suggestion--category-header-lvl0': {
                color: theme.palette.text.primary,
            },
            '& .algolia-docsearch-suggestion--subcategory-column-text': {
                color: theme.palette.text.secondary,
            },
            '& .algolia-docsearch-suggestion--highlight': {
                color: theme.palette.type === 'light' ? '#174d8c' : '#acccf1',
            },
            '& .algolia-docsearch-suggestion': {
                background: 'transparent',
            },
            '& .algolia-docsearch-suggestion--title': {
                ...theme.typography.title,
            },
            '& .algolia-docsearch-suggestion--text': {
                ...theme.typography.body1,
            },
            '& .ds-dropdown-menu': {
                boxShadow: theme.shadows[1],
                borderRadius: 2,
                '&::before': {
                    display: 'none',
                },
                '& [class^=ds-dataset-]': {
                    border: 0,
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                },
            },
        },
    },
    wrapper: {
        fontFamily: theme.typography.fontFamily,
        position: 'relative',
        marginRight: 16,
        borderRadius: 2,
        background: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            background: fade(theme.palette.common.white, 0.25),
        },
        '& $input': {
            transition: theme.transitions.create('width'),
            width: 250,
            '&:focus': {
                width: 500,
            },
        },
    },
    search: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        font: 'inherit',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme
            .spacing.unit * 9}px`,
        border: 0,
        display: 'block',
        verticalAlign: 'middle',
        whiteSpace: 'normal',
        background: 'none',
        margin: 0, // Reset for Safari
        color: 'inherit',
        width: '100%',
        '&:focus': {
            outline: 0,
        },
    },
});

class AppSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
        this.handleSearchChange = _.debounce(_.bind(this.handleSearchChange, this), 200);
    }


    delayedHandleSearchChange(query) {
        this.setState({
            query: query
        });
        this.handleSearchChange(query);
    };

    handleSearchChange = query => {
        this.props.dispatch(setSubtitleQuery(query));
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.wrapper}>
                <div className={classes.search}>
                    <SearchWeb/>
                </div>
                <input
                    id="quote-search-input"
                    className={classes.input}
                    value={this.state.query}
                    placeholder="I've got the same combination on my luggage"
                    onChange={(e) => this.delayedHandleSearchChange(e.target.value)} />
            </div>
        );
    }
}

AppSearch.propTypes = {
    dispatch: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(connect()(AppSearch));