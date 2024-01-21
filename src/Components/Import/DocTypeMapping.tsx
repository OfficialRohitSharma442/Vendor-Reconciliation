import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, message } from 'antd';
const { Option } = Select;
const DocTypeMapping = ({ Mappings, setMappings }: any) => {
    console.log(Mappings);
    const DocumentOptions = ['Contains', 'Starts With', 'Ends With'];
    const TypeHeader = ["Debit note", "Advance Payment", "TDS", "Invoice"];
    const option = ["Payment"];
    const Columns = ["Document Number", "Payment Document"];
    const handleColumnChange = (value, index) => {
        const updatedMappings = [...Mappings];
        updatedMappings[index].Column = value;
        updatedMappings[index].Type = "";
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
        updatedMappings[index] = { Column: ' ', Type: ' ', Method: ' ', Value: ' ' };
        updatedMappings?.splice(index, 1);
        setMappings(updatedMappings);
    };

    return (
        <>
            <h3 style={{ textAlign: "center", fontWeight: "600" }}>Create Mapppings</h3>
            <div style={{ height: "320px", padding: "20px 20px", overflow: "scroll", border: "1px solid black", width: "100%" }}>
                {Mappings?.map((mapping, index) => (
                    <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <Select
                            placeholder="Select Column"
                            onChange={(value) => handleColumnChange(value, index)}
                            value={mapping.Column || undefined}
                            className='doc_type_mapping'
                        >
                            {Columns?.map((item) => (
                                <Option key={item} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Documents Type"
                            value={mapping.Type || undefined}
                            onChange={(value) => handleTypeChange(value, index)}
                            className='doc_type_mapping'
                        >
                            {mapping.Column == "Payment Document" ?
                                option?.map((item) => (
                                    <Option key={item} value={item}>
                                        {item}
                                    </Option>
                                ))
                                : TypeHeader?.map((item) => (
                                    <Option key={item} value={item}>
                                        {item}
                                    </Option>
                                ))
                            }
                        </Select>
                        <Select
                            placeholder="Method"
                            onChange={(value) => handleMethodChange(value, index)}
                            className='doc_type_mapping'
                            value={mapping.Method || undefined}
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
                            className='doc_type_mapping'
                            value={mapping.Value || undefined}
                        />
                        {index === Mappings?.length - 1 ? (
                            <PlusOutlined onClick={handleAddMapping} style={{ fontSize: '20px' }} />
                        ) : (
                            <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteMapping(index)}>
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </>

    );
};

export default DocTypeMapping;
