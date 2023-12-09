import React, { useState } from 'react';
import DragAndDrop from '../utils/Drag-and-Drop';

const Home = () => {
    const [boxOneItems, setBoxOneItems] = useState([
        { id: '1', content: 'Item 1' },
        { id: '2', content: 'Item 2' },
        { id: '3', content: 'Item 3' },
        { id: '4', content: 'Item 4' },
        { id: '5', content: 'Item 5' },
        { id: '6', content: 'Item 6' },
        { id: '7', content: 'Item 7' },
        { id: '8', content: 'Item 8' },
        { id: '9', content: 'Item 9' },
        { id: '10', content: 'Item 10' },
        { id: '11', content: 'Item 11' },
        { id: '12', content: 'Item 12' },
    ]);

    const [boxTwoItems, setBoxTwoItems] = useState([]);
    const defaultStaticContent = [
        { id: 'static-1', content: 'Default Column 1' },
        { id: 'static-2', content: 'Default Column 2' },
        { id: 'static-1', content: 'Default Column 1' },
        { id: 'static-2', content: 'Default Column 2' },
        { id: 'static-1', content: 'Default Column 1' },
        { id: 'static-2', content: 'Default Column 2' },
        { id: 'static-1', content: 'Default Column 1' },
        { id: 'static-2', content: 'Default Column 2' },
        { id: 'static-1', content: 'Default Column 1' },
        { id: 'static-2', content: 'Default Column 2' },
        { id: 'static-2', content: 'Default Column 2' },
        // Add more default columns as needed
    ];

    return <DragAndDrop initialBoxOneItems={boxOneItems} initialBoxTwoItems={boxTwoItems} defaultStaticContent={defaultStaticContent} />;
};

export default Home;
