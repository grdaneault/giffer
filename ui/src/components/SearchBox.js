import React from 'react';
import PropTypes from 'prop-types';

const SearchBox = ({value, onChange}) => (
    <div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} />
    </div>
);

SearchBox.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default SearchBox