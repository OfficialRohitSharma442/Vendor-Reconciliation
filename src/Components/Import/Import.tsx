import React, { useState } from 'react';
import { Button, message, Modal, Select, Steps, theme, UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import Dragger from 'antd/es/upload/Dragger';
import { DownloadOutlined } from '@ant-design/icons';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { FileExcelOutlined } from '@ant-design/icons';
import './Import.css';
import axios from 'axios';
const { Option } = Select;
const Import = () => {
  const [size, setSize] = useState<SizeType>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [companyFile, setcompanyFile] = useState([]);
  const [companyFileJson, setcompanyFileJson] = useState<any>([]);
  const [companyFileHeaderJson, setcompanyFileHeaderJson] = useState<any>([]);
  const [companyFileSelectedValues, setcompanyFileSelectedValues] = useState(Array.from({ length: 9 }, () => ''));

  const [vendorFileSelectedValues, setvendorFileSelectedValues] = useState(Array.from({ length: 9 }, () => ''));
  const [detailedFileSelectedValues, setdetailedFileSelectedValues] = useState(Array.from({ length: 9 }, () => ''));

  
  const [vendorFileJson, setvendorFileJson] = useState<any>([]);
  const [vendorFileHeaderJson, setvendorFileHeaderJson] = useState<any>([]);
  const [detailedFileJson, setdetailedFileJson] = useState<any>([]);
  const [detailedFileHeaderJson, setdetailedFileHeaderJson] = useState<any>([]);


  // **************for model************
  const [vendorName,SetvendorName]=useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //************************** */

  console.log(companyFileSelectedValues, "lkhk")

  const handleSelectChange = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...companyFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setcompanyFileSelectedValues(updatedSelectedValues);
  };

  const handleSelectChange2 = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...vendorFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setvendorFileSelectedValues(updatedSelectedValues);
  };

  const handleSelectChange3 = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...detailedFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setdetailedFileSelectedValues(updatedSelectedValues);
  };




  const companyFileHeader = [
    "Vendor",
    "Vendor Name",
    "Document Number",
    "Invoice Number",
    "Closing Balance",
    "Invoice Amount",
    "Currency",
    "Due Date",
    "Document Date",
  ];
  const vendorFileHeader = [
    "Business Partner",
    "Business Partner Name",
    "Closing Balance",
    "Invoice Amount",
    "Currency",
    "Due Date",
    "Docment Date",
    "Document Number",
    "Invoice Number",
  ];
  const detailedFileHeader = [
    "Due Date",
    "Company Code",
    "Credit Amount(INR)",
    "Debit Amount(INR)",
    "Cheque Rtgs Neft",
    "Payment Docment",
    "Reference",
    "Grn Number",
    "Invoice Date",
    "Document Date",
    "Document Number",
    "Invoice Number",
  ]
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsm, .xlsx,.xls',
    maxCount: 1,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: true,
    customRequest: ({ file, onSuccess, onError, onUpload }: any) => {
      if (file != "" && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headers: any = jsonData[0];
            const trimmedHeaders = headers.map((str: any) => str.trim().replace(/\s+/g, ' '));
            jsonData[0] = trimmedHeaders;
            console.log('JSON Data:', jsonData);
            console.log('Headers:', headers);
            if (current == 0) {
              setcompanyFile(file);
              setcompanyFileJson(jsonData);
              setcompanyFileHeaderJson(trimmedHeaders);
              onSuccess();
            }
            else if (current == 2) {
              setvendorFileJson(jsonData);
              setvendorFileHeaderJson(trimmedHeaders);
              onSuccess();
            }
            else if (current == 4) {
              setdetailedFileJson(jsonData);
              setdetailedFileHeaderJson(trimmedHeaders);
              onSuccess();
            }
          }
        };
        reader.readAsBinaryString(file);
      }
      else {
        onError();
        message.error(`Please upload excle file.`);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const uploadFile = (Filename: any) => (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        {/* <InboxOutlined /> */}
        <FileExcelOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload {Filename}</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
        banned files.
      </p>
    </Dragger>
  );
  const steps: any = [
    {
      title: 'First',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
        </div>
      ),
    },
    {
      title: 'Second',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              companyFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange(value, index)}
                  >
                    {companyFileHeaderJson
                      .filter((option: any) => !companyFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      )
    },
    {
      title: 'Thrid',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
        </div>
      ),
    },
    {
      title: 'Foruth',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              vendorFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange2(value, index)}
                  >
                    {vendorFileHeaderJson
                      .filter((option: any) => !vendorFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      ),
    },
    {
      title: 'Five',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
        </div>
      ),
    },
    {
      title: 'Last',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              detailedFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange3(value, index)}
                  >
                    {detailedFileHeaderJson
                      .filter((option: any) => !detailedFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      ),
    },
  ];

  async function companyFileHeaderChanged() {
    if (companyFileJson.length > 0 && companyFileSelectedValues.length > 0) {
      let data = companyFileJson[0];
      companyFileSelectedValues.forEach((items) => {
        let index = data.indexOf(items);
        if (index != -1) {
          data[index] = `${items}`;
        }
      })
      let ans: any = companyFileJson;
      ans[0] = data;
      console.log(data)

      const headers: any = ans[0];
      const dataRows: any = ans;

      const transformToObjects = (headers: any, data: any) => {
        return data.map((row: any) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            const value = row[index];
            // Trim all values
            rowData[header] = `${value}`.trim();
          });
          return rowData;
        });
      };

      let transformedData = transformToObjects(headers, dataRows);
      console.log(transformedData);
      transformedData = transformedData.slice(1);

      
      const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/masterOpen";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: "masterfile",
        data: transformedData
      }
       const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllMasterData";

       let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokenforcall}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokenforcall}`
              }
            }
          )

          console.log(response2);
          if (response2) {
            showModal();
          }
        }

      }
      catch (error) {
        console.log(error)
      }


      // let response2 = await axios.get(url2,
      //   {
      //     headers: {
      //       'Authorization': ` Bearer ${tokenforcall}`
      //     }
      //   }
      // )

      // console.log(response2);
      // if (response2) {
      //   showModal();
      // }
      
    }
  }

async function vendorFileHeaderChanged(){
  if (vendorFileJson.length > 0 && vendorFileSelectedValues.length > 0) {
    let data = vendorFileJson[0];
    vendorFileSelectedValues.forEach((items) => {
      let index = data.indexOf(items);
      if (index != -1) {
        data[index] = `${items}`;
      }
    })
    let ans: any = vendorFileJson;
    ans[0] = data;
    console.log(data)

    const headers: any = ans[0];
    const dataRows: any = ans;

    const transformToObjects = (headers: any, data: any) => {
      return data.map((row: any) => {
        const rowData: any = {};
        headers.forEach((header: any, index: any) => {
          // rowData[header] = row[index];
          const value = row[index];
          // Trim all values
          rowData[header] = `${value}`.trim();
        });
        return rowData;
      });
    };

    let transformedData = transformToObjects(headers, dataRows);
    console.log(transformedData);
    transformedData = transformedData.slice(1);
    setvendorFileJson(transformedData);

    const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/vendorOpen";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: "masterfile",
        data: transformedData
      }
       const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllVendorData";

       let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokenforcall}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokenforcall}`
              }
            }
          )
          console.log(response2);
        }

      }
      catch (error) {
        console.log(error)
      }
    
  }
}
  
async function detailedFileHeaderChanged(){
  if (detailedFileJson.length > 0 && detailedFileSelectedValues.length > 0) {
    let data = detailedFileJson[0];
    detailedFileSelectedValues.forEach((items) => {
      let index = data.indexOf(items);
      if (index != -1) {
        data[index] = `${items}`;
      }
    })
    let ans: any = detailedFileJson;
    ans[0] = data;
    console.log(data)

    const headers: any = ans[0];
    const dataRows: any = ans;

    const transformToObjects = (headers: any, data: any) => {
      return data.map((row: any) => {
        const rowData: any = {};
        headers.forEach((header: any, index: any) => {
          // rowData[header] = row[index];
          const value = row[index];
          // Trim all values
          rowData[header] = `${value}`.trim();
        });
        return rowData;
      });
    };

    let transformedData = transformToObjects(headers, dataRows);
    console.log(transformedData);
    transformedData = transformedData.slice(1);
    setdetailedFileJson(transformedData);

    const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/CompleteDetails";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: "masterfile",
        data: transformedData
      }
       const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllCompleteDetailsData";

       let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokenforcall}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokenforcall}`
              }
            }
          )
          console.log(response2);
        }

      }
      catch (error) {
        console.log(error)
      }

  }
  message.success('Processing complete!')
}


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };


  const next = () => {
    if (current == 1) {
      companyFileHeaderChanged();
    }
    if(current == 3){
      vendorFileHeaderChanged();
    }
    if(current == 5){
      detailedFileHeaderChanged();
    }
    setCurrent(current + 1);
  };
  // const prev = () => {
  //   setCurrent(current - 1);
  // };
  const items = steps.map((item: any) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    height: "450px",
    // textAlign: 'center',
    // display: "grid",
    // placeItems: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `2px solid ${token.colorBorder}`,
    // border: `2px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <>
      <div style={{ margin: "20px" }}>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24, display: "Flex", justifyContent: "space-around" }}>
          {/* {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )} */}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={detailedFileHeaderChanged}>
              Generate Report
            </Button>
          )}
        </div>
      </div>

      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Select your vendor name</p>
        <Select
          className='Dropdown'
          // style={{ width: 300, margin: '8px' }}
          placeholder={`select Vender naem`}
          onChange={(value) => SetvendorName(value)}
        >
          {companyFileHeaderJson
            .filter((option: any) => !companyFileSelectedValues.includes(option))
            .map((option: any) => (
              <Option key={option} value={option}>
                {option}
              </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}

export default Import