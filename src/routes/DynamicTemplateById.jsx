import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';

const DynamicTemplateById = () => {
    const { id } = useSearchParams();
    return (
        <div>
            {
                templateDetail?.id
            }
        </div>
    )
}

export default DynamicTemplateById