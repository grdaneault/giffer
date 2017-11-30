import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem, ListItemText} from "material-ui";
import {Link} from "react-router-dom";
import MovieAvatar from "./MovieAvatar";

const SubtitleListItem = ({subtitle}) => (
    <ListItem
        button
        component={Link}
        to={`/gif/${subtitle.movie_id}/${subtitle.sub_id}`}>
        <MovieAvatar movieId={subtitle.movie_id} />
        <ListItemText
            primary={subtitle.text.replace("\n", " / ")}
            secondary={`${subtitle.start} to ${subtitle.end}`} />
    </ListItem>
);

SubtitleListItem.propTypes = {
    subtitle: PropTypes.object.isRequired
};

export default SubtitleListItem