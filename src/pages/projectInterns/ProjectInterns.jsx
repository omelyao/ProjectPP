import Multiselect from 'multiselect-react-dropdown';
import React, { useState } from 'react';

function ProjectInterns(props) {
    const options = [{"name":11}, {"name":10},{"name":9},{"name":8},{"name":7},{"name":6},{"name":5},{"name":4},{"name":3},{"name":2}]
    
    
    const [selectedValues, setSelectedValues] = useState([]);

    return (
        <div>
            <Multiselect
            options={options}
            displayValue='name'
            onSelect={(selectedList, selectedItem) =>{
            setSelectedValues([...selectedList])
        }}
        onRemove={(selectedList, removedItem) =>{
            setSelectedValues([...selectedList])
        }}
        />
        </div>
    );
}

export default ProjectInterns;