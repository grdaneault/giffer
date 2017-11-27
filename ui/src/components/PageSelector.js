import React from 'react'
import PropTypes from 'prop-types'
import {MenuItem, FormControl, InputLabel, Input, Select} from 'material-ui';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    paginationContainer: {
        padding: theme.spacing.unit * 2
    },
    paginationInfo: {
        display: 'inline-block',
        marginRight: theme.spacing.unit
    },
    pageSelector: {
        width: '100px',
    },
});

const PageSelector = ({ totalResults, pageSize, pages, page, onChange, classes }) => {

    const options = [];
    for (let i = 0; i < pages; i++) {
        options.push(<MenuItem value={i} key={i}>Page {i + 1}</MenuItem>);
    }

    const from = page * pageSize + 1;
    const to = Math.min(totalResults, (page + 1) * pageSize);

    return (
    <div className={classNames(classes.paginationContainer)}>
        <Typography type="subheading" className={classNames(classes.paginationInfo)}>
            Viewing results {from} to {to} of {totalResults}
        </Typography>
        <FormControl className={classNames(classes.pageSelector)}>
          <InputLabel htmlFor="age-simple">Jump to page</InputLabel>
          <Select
              value={page}
              onChange={e => onChange(e.target.value)}
              input={<Input name="page" id="page-simple" />}
          >
              {options}
          </Select>
        </FormControl>
  </div>
)};

PageSelector.propTypes = {
    classes: PropTypes.object.isRequired,
    totalResults: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequred,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(PageSelector);
