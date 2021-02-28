import React from 'react';
import { SimpleImg } from "react-simple-img";

const SpeakerImage = ({ id }) => (
    <SimpleImg
    src={`/speakerimages/Speaker-${id}.jpg`}
    animationDuration="1"
    width={200}
    height={200}
    applyAspectRatio="true"
    />
);

export default SpeakerImage;