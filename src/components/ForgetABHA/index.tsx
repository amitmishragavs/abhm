import React from 'react'
import Tabs from '../../common/Tabs'
import CardWrapper from '../../common/CardWrapper';
import Mobile from './Mobile';
import Aadhaar from './Aadhaar';

function ForgetABHA() {
    return (
        <CardWrapper defaultActiveKey="0" form title="Retrive ABHA">
            <Tabs active="0" titles={["Mobile", "Aadhaar"]}>
                <Mobile />
                <Aadhaar />
            </Tabs>
        </CardWrapper>
    )
}

export default ForgetABHA