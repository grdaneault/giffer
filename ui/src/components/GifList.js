import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    container: {
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

const PageSelector = ({ images }) => {
    return (
        <div className={classes.container}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                    <Subheader component="div">December</Subheader>
                </GridListTile>
                {images.map(tile => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            subtitle={<span>by: {tile.author}</span>}
                            actionIcon={
                                <IconButton>
                                    <InfoIcon color="rgba(255, 255, 255, 0.54)" />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>

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
