import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  formData: any;
};

const Capture = (props : Props ) => {
  const { formData } = props;

  const [imageHeight, setImageHeight] = useState('45%');

  const [totalCost, setTotalCost] = useState(0);

  const formatPrice = (price: string) => {
    if (price.length === 0) {
      return '';
    }

    const numericPrice = Number(price.replace(/[^0-9]/g, ''));
    return numericPrice.toLocaleString('ko-KR');
  };

  useEffect(() => {
    const materialsLength = formData.materials ? formData.materials.length : 0;

    if (materialsLength > 4) {
      const newHeight = 45 - (materialsLength - 4) * 5;
      setImageHeight(`${Math.max(newHeight, 20)}%`);
      setImageHeight('45%');
    }
  }, [formData.materials]);

  useEffect(() => {
    const totalPrices = formData.labors.reduce((sum : any, labor : any) => sum + (parseInt(labor.price) || 0), 0);
    const additionalCosts = parseInt(formData.laborCost) + parseInt(formData.visibilityCost) || 0;

    setTotalCost(totalPrices + additionalCosts);
  }, [formData]);

  return (
    <A4Container>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              rowSpan={3}
              style={{ backgroundColor: '#FEFF99', fontSize: '2rem', fontWeight: '300' }}
            >
              제이피크 메인 작업지시서
            </TableCell>
            <TableCell>디자이너</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{formData.designer}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>APM 1층 12호</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table style={{ marginTop : '5px' }}>
        <TableBody>
          <TableRow>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%' }}>공장</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.factory}</TableCell>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%' }}>투입일</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.startDate}</TableCell>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%' }}>입고일</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.endDate}</TableCell>
            <TableCell
              rowSpan={2}
              style={{ backgroundColor : '#FEFF99', width : '8.5%' }}
            >
              혼용률
            </TableCell>
            <TableCell
              rowSpan={2}
              style={{ width: '16.5%' }}
            >
              {formData.blendRatio}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%' }}>No</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.number}</TableCell>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%', fontSize: '14px' }}>SP/MAIN</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.spMain}</TableCell>
            <TableCell style={{ backgroundColor : '#FEFF99', width : '8.5%' }}>복종</TableCell>
            <TableCell style={{ width: '16.5%' }}>{formData.type}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              style={{ backgroundColor : '#FEFF99', width : '67%' }}
              isFirst
            >
              원단처
            </TableCell>
            <TableCell
              style={{ backgroundColor : '#FEFF99', width : '33%' }}
              isFirst
            >
              메인사진
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div style={{ display: 'flex' }}>
        <div
          style={{ width: '67%',
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            height: '650px',
            lineHeight: '100px',
            textAlign: 'center' }}
        >
          <div style={{ height : imageHeight, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {formData.materialImage && (
              <img
                src={URL.createObjectURL(formData.materialImage)}
                alt=""
                style={{ height: '100%', width: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
          <div style={{ height : '65%', width: '100%' }}>
            {formData.materials && formData.materials.map((material: any, index: number) => (
              <Table
                key={index}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell style={{ width: '25%', fontWeight: '700', border: 'none', textAlign: 'start', height: 'auto' }}>{material.name ?`*${material.name}` : ''}</TableCell>
                    <TableCell style={{ width: '25%', fontWeight: '700', border: 'none', textAlign: 'start', height: 'auto' }}>{material.number ? `${material.number}호` : ''}</TableCell>
                    <TableCell style={{ width: '25%', fontWeight: '700', border: 'none', textAlign: 'start', height: 'auto' }}>{material.phone}</TableCell>
                    <TableCell
                      style={{ width: '25%', border: 'none', fontWeight: '700', fontSize: '20px', height: 'auto' }}
                      rowSpan={2}
                    >
                      {material.otherDetail ? `<${material.otherDetail}>` : ''}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ height : 'auto', paddingTop: '5px' }}>
                    <TableCell style={{ width: '25%', fontSize: '13px', border: 'none', textAlign: 'start' }}>{material.task ? `·${material.task}` : ''}</TableCell>
                    <TableCell style={{ width: '25%', fontSize: '13px', height: 'auto', whiteSpace : 'pre-line', border: 'none', textAlign: 'start' }}><div>{material.detailOne}</div></TableCell>
                    <TableCell style={{ width: '25%', fontSize: '13px', height: 'auto', whiteSpace : 'pre-line', border: 'none', textAlign: 'start' }}>{material.detailTwo}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ))}
          </div>
        </div>
        <div
          style={{ width: '33%',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            height: '650px',
            lineHeight: '100px',
            textAlign: 'center' }}
        >
          <div style={{ height : '50%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {formData.mainImage && (
              <img
                src={URL.createObjectURL(formData.mainImage)}
                alt=""
                style={{ height: '100%', width: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
          <div style={{ height: '30%', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'minmax(auto, max-content)' }}>
            <Table style={{ width: '100%', marginBottom: '10px' }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '10%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>공임</TableCell>
                  <TableCell style={{ width: '40%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>{formatPrice(formData.laborCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table style={{ width: '100%', marginBottom: '10px' }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '10%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>시야게</TableCell>
                  <TableCell style={{ width: '40%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>{formatPrice(formData.visibilityCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {formData.labors && formData.labors.map((labor: any, index: number) => (
              <div
                key={index}
                style={{ marginBottom: '10px' }}
              >
                <Table style={{ width: '100%' }}>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ width: '10%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>{labor.cost}</TableCell>
                      <TableCell style={{ width: '40%', textAlign: 'start', height: 'auto', whiteSpace: 'nowrap', border: 'none' }}>{formatPrice(labor.price)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <div style={{ height: '20%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Table style={{ width: '100%' }}>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '30%', height: '50px', whiteSpace: 'nowrap', fontSize: '23px', borderLeft: 'none', fontWeight: '600' }}>공임</TableCell>
                  <TableCell style={{ width: '70%', textAlign: 'start', height: '50px', whiteSpace: 'nowrap', padding: '0 5px', fontSize: '16px', borderRight: 'none' }}>
                    {formData.visibilityCost ? `${formatPrice(formData.laborCost)}원/ 시야게${formatPrice(formData.visibilityCost)}원` : `${formatPrice(formData.laborCost)}원`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table style={{ width: '100%' }}>
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{ width: '30%',
                      height: '50px',
                      whiteSpace: 'nowrap',
                      fontSize: '23px',
                      borderLeft: 'none',
                      fontWeight: '600',
                      borderBottom: 'none' }}
                  >
                    원가
                  </TableCell>
                  <TableCell
                    style={{ width: '70%',
                      textAlign: 'start',
                      height: '50px',
                      whiteSpace: 'nowrap',
                      paddingLeft: '10px',
                      fontSize: '23px',
                      borderRight: 'none',
                      borderBottom: 'none' }}
                  >
                    {`${formatPrice(totalCost.toString())}원`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', width : '100%', height: '282px', border: '1px solid black', borderTop: 'none' }}>
        <div style={{ width : '8.5%', backgroundColor: '#FEFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black' }}>
          스와치
        </div>
        <div style={{ width : '91.5%' }}>
          <Table style={{ width: '100%' }}>
            <TableBody>
              <TableRow>
                <TableCell
                  borderNone
                  style={{ width: '7.5%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.5' }}
                  rowSpan={2}
                >
                  {`출고
                  수량`}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '7.5%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black',
                    fontSize: '13px' }}
                >
                  COLOR
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[0] ? formData.quantities[0].color : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[1] ? formData.quantities[1].color : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[2] ? formData.quantities[2].color : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[3] ? formData.quantities[3].color : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[4] ? formData.quantities[4].color : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  borderNone
                  style={{ width: '7.5%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black',
                    fontSize: '13px' }}
                >
                  수량
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[0] ? formData.quantities[0].quantity : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[1] ? formData.quantities[1].quantity : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[2] ? formData.quantities[2].quantity : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[3] ? formData.quantities[3].quantity : ''}
                </TableCell>
                <TableCell
                  borderNone
                  style={{ width: '17%',
                    borderBottom: '1px solid black' }}
                >
                  {formData.quantities[4] ? formData.quantities[4].quantity : ''}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </A4Container>
  );
};

const A4Container = styled.div`
  width: 100%; 
  background: white;
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  text-align:center; 

`;

const TableBody = styled.tbody`
  vertical-align: middle;
  text-align:center; 
`;

const TableCell = styled.td<{ isFirst?: boolean; borderNone?: boolean; }>`
  /* border: 1px solid black;  */
  border: ${({ borderNone }) => borderNone ? 'none' : '1px solid black'};
  vertical-align: middle;
  text-align:center; 
  height: 25px;
  line-height: 1;
  border-top: ${({ isFirst }) => isFirst ? 'none' : '1px solid black'};
`;

export default Capture;
