import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import "./dragdrop.css"
import { HolderOutlined } from "@ant-design/icons";
import { message } from 'antd';
const DragAndDrop = ({ initialBoxOneItems, boxTwoItems, setBoxTwoItems, defaultStaticContent }: any) => {
    interface BoxItem {
        id: string;
        content: string; // or any other type
    }
    const [boxOneItems, setBoxOneItems] = React.useState<BoxItem[]>([]);
    useEffect(() => {
        setBoxOneItems(initialBoxOneItems);
    }, [initialBoxOneItems])
    // console.log(boxTwoItems);       
    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }
        const sourceList = source.droppableId;
        const destinationList = destination.droppableId;
        // Validate if moving item to the static column
        if (destinationList === "droppable-2" && boxTwoItems.length >= defaultStaticContent.length) {
            // You can show an alert or any other form of feedback to the user
            alert('Cannot add more items to the static column.');
            return;
        }

        if (sourceList === 'droppable-1') {
            const newBoxOneItems = [...boxOneItems];
            const [draggedItem] = newBoxOneItems.splice(source.index, 1);

            if (destinationList === 'droppable-1') {
                newBoxOneItems.splice(destination.index, 0, draggedItem);
                setBoxOneItems(newBoxOneItems);
            }
            else {
                if (boxTwoItems.length < defaultStaticContent.length) {
                    setBoxTwoItems((prev: any) => [...prev, draggedItem]);
                    setBoxOneItems(newBoxOneItems);
                } else {
                    message.error(`You cannot drop more than ${defaultStaticContent.length} columns`);
                }
            }
        }

        if (sourceList === 'droppable-2') {
            const newBoxTwoItems = [...boxTwoItems];
            const [draggedItem] = newBoxTwoItems.splice(source.index, 1);

            if (destinationList === 'droppable-2') {
                newBoxTwoItems.splice(destination.index, 0, draggedItem);
                setBoxTwoItems(newBoxTwoItems);
            } else {
                setBoxOneItems((prev: any) => [...prev, draggedItem]);
                setBoxTwoItems(newBoxTwoItems);
            }
        }
    };
    const itemStyle = {
        border: '1px solid gray',
        backgroundColor: 'white',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        fontWeight: "500",
        padding: "5px",
    };
    const itemStyle1 = {
        border: '1px solid gray',
        backgroundColor: 'white',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        fontWeight: "500",
        padding: "5px",
        background: "#fafafa"
    };
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', position: 'relative', gap: "20px", justifyContent: "center" }}>
                    {/* Static box with line */}
                    <div
                        style={{
                            position: 'relative',

                        }}
                    >
                        <p style={{ margin: "5px", textAlign: "center",  fontWeight: "bold" }}>Static Column</p>
                        <div
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                height: "450px",
                                padding: '1rem',
                                // backgroundColor: '#e0e0e0',
                                width: '230px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                marginBottom: '0.5rem',
                                background: "#fafafa"
                            }}
                        >
                            {/* <div style={{ fontWeight: 'bold', textAlign:"center" }}>Static Columns</div> */}
                            {/* Map through default static content */}
                            {defaultStaticContent?.map((item: any) => (
                                <div key={item.id} style={itemStyle1} >
                                    <div style={{ marginRight: '8px' }}>
                                        {/* <FontAwesomeIcon icon={faArrowsAlt} /> */}
                                        <HolderOutlined />
                                    </div>
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
                                // borderLeft: '1px solid #ccc',
                                height: '100%',
                            }}
                        />
                    </div>

                    {/* Droppable for boxTwoItems */}
                    <div>
                        <p style={{ margin: "5px", textAlign: "center", fontWeight: "bold" }}>Drop Column</p>

                        <Droppable droppableId="droppable-2">

                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        border: snapshot?.isDraggingOver ? `` : '2px dashed #ccc',
                                        padding: '14px 16px',
                                        backgroundColor: snapshot.isDraggingOver ? '#f8f8f8' : '#fff',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        minWidth: "230px",
                                        height: "450px",
                                    }}
                                    className={` ${snapshot?.isDraggingOver && "rotate-border"}`}
                                >

                                    {boxTwoItems.map((item: any, index: any) => (
                                        <Draggable key={item?.id} draggableId={item?.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided?.innerRef}
                                                    {...provided?.draggableProps}
                                                    {...provided?.dragHandleProps}
                                                    style={{
                                                        ...itemStyle,
                                                        border: '1px solid gray',
                                                        backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
                                                        ...provided.draggableProps.style,
                                                        maxHeight: "20px"
                                                    }}
                                                >
                                                    <div style={{ marginRight: '8px' }}>
                                                        {/* <FontAwesomeIcon icon={faArrowsAlt} /> */}
                                                        <HolderOutlined />
                                                    </div>
                                                    {item?.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided?.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    {/* Droppable for boxOneItems */}
                    <div>
                        <p style={{ margin: "5px", textAlign: "center", fontWeight: "bold" }}>Uploaded file Column</p>

                        <Droppable droppableId="droppable-1">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        border: '2px dashed #ccc',
                                        padding: '14px 16px',
                                        backgroundColor: snapshot.isDraggingOver ? '#f8f8f8' : '#fff',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        height: "450px",
                                        width: "240px",
                                        overflow: "scroll"
                                    }}
                                >
                                    {boxOneItems?.map((item: any, index: any) => (
                                        <Draggable key={item?.id} draggableId={item?.id} index={index}>
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
                                                            {/* <FontAwesomeIcon icon={faArrowsAlt} /> */}
                                                            <HolderOutlined />
                                                        </div>
                                                        {item?.content}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                </div >
            </DragDropContext >
        </>
    );
};
export default DragAndDrop;
