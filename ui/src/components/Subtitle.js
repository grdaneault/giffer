import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem, ListItemText} from "material-ui";
import {Link} from "react-router-dom";

const Subtitle = ({subtitle}) => (
    <ListItem
        button
        component={Link}
        to={`/gif/${subtitle.movie_id}/${subtitle.sub_id}`}>
        <Avatar src="https://giffer.nyc3.digitaloceanspaces.com/movies/10674-cover.jpg" />
        <ListItemText
            primary={subtitle.text}
            secondary={`${subtitle.start} to ${subtitle.end}`} />
    </ListItem>
);

Subtitle.propTypes = {
    subtitle: PropTypes.object.isRequired
};

export default Subtitle