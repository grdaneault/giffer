import React from 'react'
import PropTypes from 'prop-types'
import {MenuItem, FormControl, InputLabel, Input, Select} from 'material-ui';

const PageSelector = ({ totalResults, pageSize, pages, page, onChange }) => {

    const options = [];
    for (let i = 0; i < pages; i++) {
        options.push(<MenuItem value={i} key={i}>Page {i + 1}</MenuItem>);
    }

    const from = page * pageSize + 1;
    const to = Math.min(totalResults, (page + 1) * pageSize);

    return (
    <span>
        <span>
            Viewing results {from} to {to} of {totalResults}
        </span>
        <FormControl>
          <InputLabel htmlFor="age-simple">Jump to page</InputLabel>
          <Select
              value={page}
              onChange={e => onChange(e.target.value)}
              input={<Input name="page" id="page-simple" />}
          >
              {options}
          </Select>
        </FormControl>
  </span>
)};

PageSelector.propTypes = {
    totalResults: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequred,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default PageSelector;
