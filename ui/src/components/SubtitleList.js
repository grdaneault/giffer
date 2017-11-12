import React from 'react';
import PropTypes from 'prop-types';
import Subtitle from "./Subtitle";

const SubtitleList = ({subtitles}) => (
    <ul>
        {
            subtitles.map((subtitle, i) =>
                <li key={i}>
                    <Subtitle subtitle={subtitle} />
                </li>
            )
        }
    </ul>
);

SubtitleList.propTypes = {
    subtitles: PropTypes.array.isRequired
};

export default SubtitleList