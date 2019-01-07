import './Sponsors.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../..';
import { getSponsors, getCurrentConfig } from '../../../../../ducks/current';
import { DevfestDetails } from '../../../../../config/delorean.details';
import { GridList, GridListTile } from '@material-ui/core';

type SponsorsProps = ReturnType<typeof mapStateToProps>;

const Sponsors = (props: SponsorsProps) => {
    const {config, sponsors} = props;

    const buildSponsorTiles = () => Object.keys(sponsors).map(key => {
        let sponsor = sponsors[key];

        return (
            <GridListTile key={key} 
                className="sponsor-tile" 
                classes={{ 
                    tile: 'tile-override', 
                    imgFullWidth: 'image-override',
                    imgFullHeight: 'image-override' 
                }}
                onClick={() => window.open(sponsor.siteUri)}>
                <img className="sponsor-image" src={sponsor.logoUri} />
            </GridListTile>
        );
    });
    
    return(
        <React.Fragment>
            <div className="action container-thin">
                <span>{`Meet the organizations that make ${DevfestDetails.location} ${DevfestDetails.name} possible. If you’d like to learn more about sponsorships, read our `}</span>
                <a href="https://docs.google.com/document/d/15Bj6Cw9wZ6a128YijDlbfL8LwpuZ-mKhMgjg1DHrp5w/edit?usp=sharing">Sponsor Prospectus</a>
                <span> or </span>
                <a href={config && config.org ? `mailto:${config.org.email}` : ''}>email us</a>
            </div>

            <div className="sponsor-grid container" >
                <GridList classes={{ root: 'grid-root' }} cellHeight={90} cols={4}>
                    {sponsors ? buildSponsorTiles() : null}
                </GridList>
            </div>
        </React.Fragment>

    );
};

const mapStateToProps = (state: ApplicationState) => ({
    sponsors: getSponsors(state),
    config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Sponsors);