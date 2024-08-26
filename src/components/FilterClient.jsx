'use client';

import { useState } from 'react';
import Filter from './Filter';

const FiltersClient = ({ initialFilterParams }) => {
    const [filterParams, setFilterParams] = useState(initialFilterParams);

    const handleFilterChange = (newFilters) => {
        const urlParams = new URLSearchParams(newFilters);
        const updatedUrl = `?${urlParams.toString()}`;
        window.history.replaceState(null, '', updatedUrl);
        setFilterParams(newFilters);
        // Trigger any other actions necessary to update the UI
    };

    return (
        <Filter onFilterChange={handleFilterChange}/>
    );
};

export default FiltersClient;
