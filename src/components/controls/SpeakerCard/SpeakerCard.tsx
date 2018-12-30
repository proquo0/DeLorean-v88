import './SpeakerCard.scss';

import * as React from 'react';
import { connect } from 'react-redux';

import { Speaker } from '../../../models/speaker';

import { Card, Typography, Button } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import { ApplicationState } from '../../..';
import { getIsEditMode } from '../../../ducks/admin';
import { DocumentReference } from '@firebase/firestore-types';
import { Dispatch, bindActionCreators } from 'redux';
import { editSpeaker } from '../../../sagas/editor';

type SpeakerCardProps = SpeakerCardAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SpeakerCardAttribs = {
    speaker: Speaker;
    documentRef: DocumentReference;
};

class SpeakerCard extends React.Component<SpeakerCardProps> {

    buildActionButtons = () => {
        if (this.props.isEditMode) {
            return (
                <React.Fragment>
                    <Button variant="text" className="action edit" onClick={this.onEditClicked}>
                        <Edit />
                    </Button>
                    <Button variant="text" className="action delete" onClick={this.onDeleteClicked}>
                        <Delete />
                    </Button>
                </React.Fragment>
            );
        }

        return null;
    }

    onDeleteClicked = e => {
        const { documentRef } = this.props;
        documentRef.delete();
    }

    onEditClicked = e => {
        const { documentRef, speaker, editSpeaker } = this.props;

        editSpeaker(documentRef, speaker);
    }

    render() {
        const {speaker} = this.props;

        return (
            <React.Fragment>
                <Card className="speaker-card">
                    {this.buildActionButtons()}

                    <div className="header">

                        <img className="portrait-image portrait-avatar" src={speaker.portraitUrl} />

                    </div>
                    <div className="content">
                        <Typography variant="subtitle1">{speaker.name}</Typography>

                        {
                            speaker.company ? 
                            <Typography variant="subtitle1" >
                                {speaker.company}
                            </Typography> : null
                        }
                    </div>
                </Card>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    editSpeaker
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerCard);