import { Input, Select, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;
const DocTypeMapping = ({ Mappings, setMappings }: any) => {
    // console.log(Mappings);
    const DocumentOptions = ['Starts With', 'Ends With', 'Contains'];
    const TypeHeader = ["Debit note", "Payment", "Advance Payment", "TDS", "Invoice"];
    const Columns = ["Document Number", "Payment Document"];
    const handleColumnChange = (value, index) => {
        const updatedMappings = [...Mappings];
        updatedMappings[index].Column = value;
        setMappings(updatedMappings);
    };
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
        if (Mappings?.at(-1)?.Column != '' && Mappings?.at(-1)?.Method != '' && Mappings?.at(-1)?.Type != '' && Mappings?.at(-1)?.Value?.trim() != '') {
            setMappings([...Mappings, { Column: '', Type: '', Method: '', Value: '' }]);
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
        <div style={{ height: "250px", padding: "20px 20px", overflow: "scroll", border: "1px solid black", width: "750px" }}>
            {Mappings?.map((_, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <Select
                        placeholder="Select Column"
                        onChange={(value) => handleColumnChange(value, index)}
                    // defaultValue={mapping?.Type != "" ? mapping?.Type : undefined}
                    >
                        {Columns?.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Documents Type"
                        // defaultValue={mapping?.Type != "" ? mapping?.Type : undefined}
                        onChange={(value) => handleTypeChange(value, index)}
                    // value={mapping}
                    // className='doc_type_mapping'
                    >
                        {TypeHeader?.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Method"
                        // defaultValue={mapping?.Method != "" ? mapping?.Method : undefined}
                        onChange={(value) => handleMethodChange(value, index)}
                    // className='doc_type_mapping'
                    >
                        {DocumentOptions?.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="Text"
                        onChange={(e) => handleValueChange(e, index)}
                    // className='doc_type_mapping'
                    />
                    {index === Mappings?.length - 1 ? (
                        <PlusOutlined onClick={handleAddMapping}  style={{ fontSize: '20px' }}   />
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
