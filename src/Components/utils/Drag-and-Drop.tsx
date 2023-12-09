import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./dragdrop.css"

const DragAndDrop = ({ initialBoxOneItems, initialBoxTwoItems, defaultStaticContent }) => {
    const [boxOneItems, setBoxOneItems] = React.useState(initialBoxOneItems || []);
    const [boxTwoItems, setBoxTwoItems] = React.useState(initialBoxTwoItems || []);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const sourceList = source.droppableId;
        const destinationList = destination.droppableId;

        if (sourceList === 'droppable-1') {
            const newBoxOneItems = [...boxOneItems];
            const [draggedItem] = newBoxOneItems.splice(source.index, 1);

            if (destinationList === 'droppable-1') {
                newBoxOneItems.splice(destination.index, 0, draggedItem);
                setBoxOneItems(newBoxOneItems);
            } else {
                setBoxTwoItems((prev) => [...prev, draggedItem]);
                setBoxOneItems(newBoxOneItems);
            }
        }

        if (sourceList === 'droppable-2') {
            const newBoxTwoItems = [...boxTwoItems];
            const [draggedItem] = newBoxTwoItems.splice(source.index, 1);

            if (destinationList === 'droppable-2') {
                newBoxTwoItems.splice(destination.index, 0, draggedItem);
                setBoxTwoItems(newBoxTwoItems);
            } else {
                setBoxOneItems((prev) => [...prev, draggedItem]);
                setBoxTwoItems(newBoxTwoItems);
            }
        }
    };

    const itemStyle = {
        border: '1px solid gray',
        padding: '1rem',
        backgroundColor: 'white',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', position: 'relative' }}>
                    {/* Static box with line */}
                    <div
                        style={{
                            position: 'relative',
                            marginRight: '1rem',
                        }}
                    >
                        <div
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '1rem',
                                backgroundColor: '#e0e0e0',
                                width: '200px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>Static Columns</div>
                            {/* Map through default static content */}
                            {defaultStaticContent.map((item) => (
                                <div key={item.id} style={itemStyle}>
                                    {item.content}
                                </div>
                            ))}
                        </div>

                        {/* Line connecting static box to droppable items */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '100%',
                                transform: 'translate(0, -50%)',
                                borderLeft: '1px solid #ccc',
                                height: '100%',
                            }}
                        />
                    </div>

                    {/* Droppable for boxTwoItems */}
                    <Droppable droppableId="droppable-2">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    border: snapshot.isDraggingOver ? `` : '2px dashed #ccc',
                                    padding: '1.5rem',
                                    margin: '1rem',
                                    backgroundColor: snapshot.isDraggingOver ? '#f8f8f8' : '#fff',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                }}
                                className={` ${snapshot.isDraggingOver && "rotate-border"}`}
                            >
                                {boxTwoItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...itemStyle,
                                                    border: '1px solid gray',
                                                    backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                {item.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Droppable for boxOneItems */}
                    <Droppable droppableId="droppable-1">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    border: '2px dashed #ccc',
                                    padding: '1.5rem',
                                    margin: '1rem',
                                    backgroundColor: snapshot.isDraggingOver ? '#f8f8f8' : '#fff',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                }}
                            >
                                {boxOneItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...itemStyle,
                                                    border: '1px solid gray',
                                                    backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ marginRight: '8px' }}>
                                                        <FontAwesomeIcon icon={faArrowsAlt} />
                                                    </div>
                                                    {item.content}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div >
            </DragDropContext >
        </>
    );
};



export default DragAndDrop;
