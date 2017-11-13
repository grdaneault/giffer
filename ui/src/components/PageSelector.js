import React from 'react'
import PropTypes from 'prop-types'

const PageSelector = ({ pages, page, onChange }) => {

    const options = [];
    for (let i = 0; i < pages; i++) {
        options.push(<option value={i} key={i}>Page {i + 1}</option>);
    }

    return (
    <span>
    <select onChange={e => onChange(e.target.value)} value={page}>
        {options}
    </select>
  </span>
)};

PageSelector.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default PageSelector;
