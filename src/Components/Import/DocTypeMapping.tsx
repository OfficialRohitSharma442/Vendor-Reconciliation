import React, { useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

const DocTypeMapping = () => {
    const [mappings, setMappings] = useState([
        { Type: 'TDS', Method: 'ends-with', Value: 'Rohit' }
    ]);

    console.log(mappings)
    const DocumentOptions = [
        { value: 'starts-with', label: 'Starts With' },
        { value: 'ends-with', label: 'Ends With' },
        { value: 'Contains', label: 'Contains' },
    ];

    const TypeHeader = ['TDS', 'PID', 'AAD'];

    const handleTypeChange = (value, index) => {
        const updatedMappings = [...mappings];
        updatedMappings[index].Type = value;
        setMappings(updatedMappings);
    };

    const handleMethodChange = (value, index) => {
        const updatedMappings = [...mappings];
        updatedMappings[index].Method = value;
        setMappings(updatedMappings);
    };

    const handleValueChange = (e, index) => {
        const updatedMappings = [...mappings];
        updatedMappings[index].Value = e.target.value;
        setMappings(updatedMappings);
    };

    const handleAddMapping = () => {
        if (mappings.at(-1)?.Method != '' && mappings.at(-1)?.Type != '' && mappings.at(-1)?.Value?.trim() != '') {
            setMappings([...mappings, { Type: '', Method: '', Value: '' }]);
        } else {
            message.error("Field should not be empty")
        }
    };

    const handleDeleteMapping = (index) => {
        const updatedMappings = [...mappings];
        updatedMappings.splice(index, 1);
        setMappings(updatedMappings);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                <Select
                    placeholder="Please add the doc type"
                    onChange={(value) => handleTypeChange(value, "1")}
                    className='doc_type_mapping'
                >
                    {TypeHeader.map((item) => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}
                </Select>
                <Select
                    placeholder="Please select Method"
                    onChange={(value) => handleMethodChange(value, "1")}
                    className='doc_type_mapping'
                >
                    {DocumentOptions.map((item) => (
                        <Option key={item.value} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
                <Input
                    placeholder="Basic usage"
                    onChange={(e) => handleValueChange(e, "1")}
                    // className='doc_type_mapping'
                />
                <PlusOutlined onClick={handleAddMapping} />
            </div>

            {mappings.map((mapping, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <Select
                        placeholder="Please add the doc type"
                        // value={mapping.Type}
                        defaultValue={mapping.Type != "" ? mapping.Type : undefined}
                        onChange={(value) => handleTypeChange(value, index)}
                        className='doc_type_mapping'
                    >
                        {TypeHeader.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Please select Method"
                        // value={mapping.Method}
                        defaultValue={mapping.Method != "" ? mapping.Method : undefined}
                        onChange={(value) => handleMethodChange(value, index)}
                        className='doc_type_mapping'
                    >
                        {DocumentOptions.map((item) => (
                            <Option key={item.value} value={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="Basic usage"
                        // value={mapping.Value}
                        onChange={(e) => handleValueChange(e, index)}
                        className='doc_type_mapping'
                    />
                    {index === mappings.length - 1 ? (
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
