import React, { useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

const DocTypeMapping = ({ Mappings, setMappings }: any) => {
    // console.log(Mappings);
    const DocumentOptions = [
        { value: 'starts-with', label: 'Starts With' },
        { value: 'ends-with', label: 'Ends With' },
        { value: 'Contains', label: 'Contains' },
    ];

    const TypeHeader = ['TDS', 'PID', 'AAD'];

    const handleTypeChange = (value, index) => {
        const updatedMappings = [...Mappings];
        updatedMappings[index].Type = value;
        setMappings(updatedMappings);
    };

    const handleMethodChange = (value, index) => {
        const updatedMappings = [...Mappings];
        updatedMappings[index].Method = value;
        setMappings(updatedMappings);
    };

    const handleValueChange = (e, index) => {
        const updatedMappings = [...Mappings];
        updatedMappings[index].Value = e.target.value;
        setMappings(updatedMappings);
    };

    const handleAddMapping = () => {
        if (Mappings?.at(-1)?.Method != '' && Mappings?.at(-1)?.Type != '' && Mappings?.at(-1)?.Value?.trim() != '') {
            setMappings([...Mappings, { Type: '', Method: '', Value: '' }]);
        } else {
            message.error("Field should not be empty")
        }
    };

    const handleDeleteMapping = (index) => {
        const updatedMappings = [...Mappings];
        updatedMappings?.splice(index, 1);
        setMappings(updatedMappings);
    };

    return (
        <div>
            <p>Default Mapping</p>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                <Select
                    placeholder="Please add the doc type"
                    value={"SPI"}
                    className='doc_type_mapping'
                    disabled
                >
                </Select>
                <Select
                    placeholder="Please select Method"
                    value={"Contains"}
                    className='doc_type_mapping'
                    disabled
                >
                </Select>
                <Input
                    placeholder="Basic usage"
                    value={"Other All Mapped To This Document Type"}
                    disabled
                // className='doc_type_mapping'
                />
            </div>
            <p>Create Mappping</p>
            {Mappings?.map((mapping, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <Select
                        placeholder="Documents Type"
                        defaultValue={mapping?.Type != "" ? mapping?.Type : undefined}
                        onChange={(value) => handleTypeChange(value, index)}
                        className='doc_type_mapping'
                    >
                        {TypeHeader?.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Method"
                        defaultValue={mapping?.Method != "" ? mapping?.Method : undefined}
                        onChange={(value) => handleMethodChange(value, index)}
                        className='doc_type_mapping'>
                        {DocumentOptions?.map((item) => (
                            <Option key={item.value} value={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="Text"
                        onChange={(e) => handleValueChange(e, index)}
                        className='doc_type_mapping'
                    />
                    {index === Mappings?.length - 1 ? (
                        <PlusOutlined onClick={handleAddMapping} />
                    ) : (
                        <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteMapping(index)}>
                            Delete
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DocTypeMapping;
