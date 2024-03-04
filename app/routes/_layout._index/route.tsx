import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import CustomDropdown from '~/components/select';

import Capture from './capture';

export { meta } from './server';

export default function Index() {
  const [formData, setFormData] = useState<any>({
    designer: '',
    factory: '',
    startDate: '',
    endDate: '',
    number: '',
    spMain: '',
    type: '',
    blendRatio: '',
    materialImage: '',
    materials: [{ name: '', number: '', phone: '', task: '', detailOne: '', detailTwo: '', otherDetail: '' }],
    mainImage: null,
    laborCost: '',
    visibilityCost: '',
    labors: [{ cost: '', price: '' }],
    costGroups: [],
    quantities: [{ color: '', quantity: '' }],
  });

  const [image, setImage] = useState<any>(null);

  const [componentSet, setComponentSet] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const componentSetHandler = () => {
    setComponentSet(!componentSet);
    setImage(null);
  };

  const captureImage = async () => {
    if (captureRef.current) {
      let dataUrl = '';
      const minDataLength = 2000000; // 최소 데이터 길이 설정
      let attempts = 0; // 시도 횟수 카운터
      const maxAttempts = 10; // 최대 시도 횟수

      while (dataUrl.length < minDataLength && attempts < maxAttempts) {
        // htmlToImage.toJpeg을 이용하여 DOM을 이미지로 변환
        dataUrl = await htmlToImage.toJpeg(captureRef.current, {
          skipFonts: true,
          fontEmbedCSS: '',
        });
        attempts += 1; // 시도 횟수 증가
      }

      setImage(dataUrl);
    }
  };

  const downloadImage = (imageData : any) => {
    download(imageData, 'form.png');
  };

  const addMaterial = () => {
    const newMaterials = [...formData.materials, { name: '', number: '', phone: '', task: '', detailOne: '', detailTwo: '', otherDetail: '' }];
    setFormData({ ...formData, materials: newMaterials });
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1){
      const newMaterials = [...formData.materials];
      newMaterials.splice(index, 1);
      setFormData({ ...formData, materials: newMaterials });
    }
  };

  const addLaborInput = () => {
    const newLabors = [...formData.labors, { cost: '', price: '' }];
    setFormData({ ...formData, labors: newLabors });
  };

  const removeLaborInput = (index: number) => {
    if (formData.labors.length > 1){
      const newLabors = [...formData.labors];
      newLabors.splice(index, 1);
      setFormData({ ...formData, labors: newLabors });
    }
  };

  const addCostGroup = () => {
    if (formData.costGroups.length < 2){
      setFormData({
        ...formData,
        costGroups: [
          ...formData.costGroups,
          { title: '', costs: [{ name: '', price: '' }] },
          { title: '', costs: [{ name: '', price: '' }] },
        ],
      });
    }
  };

  const removeCostGroup = () => {
    setFormData({ ...formData, costGroups: [] });
  };

  // 특정 원가 계산 그룹 내의 새비용 항목을 추가하는 함수
  const addCostItem = (groupIndex : any) => {
    const newCostGroups = [...formData.costGroups];
    newCostGroups[groupIndex].costs.push({ name: '', price: '' });
    setFormData({ ...formData, costGroups: newCostGroups });
  };

  const removeCostItem = (groupIndex: number, costIndex: number) => {
    if (formData.costGroups[groupIndex].costs.length > 1){
      const newCostGroups = [...formData.costGroups];
      const newCosts = [...newCostGroups[groupIndex].costs];
      newCosts.splice(costIndex, 1);
      newCostGroups[groupIndex].costs = newCosts;
      setFormData({ ...formData, costGroups: newCostGroups });
    }
  };

  const addQuantity = () => {
    if (formData.quantities.length < 5) {
      const newQuantities = [...formData.quantities, { color: '', quantity: '' }];
      setFormData({ ...formData, quantities: newQuantities });
    }
  };

  const removeQuantity = (index: number) => {
    if (formData.quantities.length > 1){
      const newQuantities = [...formData.quantities];
      newQuantities.splice(index, 1);
      setFormData({ ...formData, quantities: newQuantities });
    }
  };

  const handleChange = (e : any, section : string, index : number, field : string) => {
    // 새로운 데이터 복사본 생성
    const newData = [...formData[section]];

    // 특정 필드 업데이트
    newData[index] = { ...newData[index], [field]: e.target.value };

    // formData 상태 업데이트
    setFormData({ ...formData, [section]: newData });
  };

  const formatPrice = (price: string) => {
    if (price.length === 0) {
      return '';
    }

    const numericPrice = Number(price.replace(/[^0-9]/g, ''));
    return numericPrice.toLocaleString('ko-KR');
  };

  const formatDate = (dateStr : any) => {
    // 숫자만 남깁니다.
    const nums = dateStr.replace(/[^\d]/g, '');

    // 날짜 형식에 맞게 포맷합니다.
    let newDate = '';

    if (nums.length > 2) {
      newDate = `${nums.substring(0, 2)}/${nums.substring(2)}`;
    } else {
      newDate = nums;
    }

    if (nums.length > 4) {
      newDate = `${nums.substring(0, 2)}/${nums.substring(2, 4)}/${nums.substring(4, 6)}`;
    }
    return newDate;
  };

  // 날짜 입력 처리를 위한 onChange 핸들러
  const handleDateChange = (e : any, field : string) => {
    const newDate = formatDate(e.target.value);
    setFormData({ ...formData, [field]: newDate });
  };

  const convertFileToBase64 = (file : any, callback : any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      callback(reader.result);
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  };

  return (
    <Wrapper>
      {!componentSet ? (
        <CreateContainer>
          <Title>
            작업 지시서
          </Title>
          <InputWrapper>
            <Label isFirst>
              디자이너
            </Label>
            <Input
              type="text"
              value={formData.designer}
              onChange={e => setFormData({ ...formData, designer: e.target.value })}
            />
          </InputWrapper>
          <Divider />
          <SubTitle>
            작업 정보
          </SubTitle>
          <InputWrapper>
            <Label isFirst>
              공장
            </Label>
            <Input
              type="text"
              value={formData.factory}
              onChange={e => setFormData({ ...formData, factory: e.target.value })}
            />
            <Label>
              투입일
            </Label>
            <Input
              type="text"
              value={formData.startDate}
              onChange={(e) => handleDateChange(e, 'startDate')}
            />
            <Label>
              입고일
            </Label>
            <Input
              type="text"
              value={formData.endDate}
              onChange={(e) => handleDateChange(e, 'endDate')}
            />
          </InputWrapper>
          <InputWrapper>
            <Label isFirst>
              No
            </Label>
            <Input
              type="text"
              value={formData.number}
              onChange={e => setFormData({ ...formData, number: e.target.value })}
            />
            <Label>
              SP/MAIN
            </Label>
            <CustomDropdown
              formData={formData}
              setFormData={setFormData}
            />
            <Label>
              복종
            </Label>
            <Input
              type="text"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            />
          </InputWrapper>
          <InputWrapper>
            <Label isFirst>
              혼용율
            </Label>
            <Input
              type="text"
              value={formData.blendRatio}
              onChange={e => setFormData({ ...formData, blendRatio: e.target.value })}
            />
          </InputWrapper>
          <Divider />
          <SubTitle>
            원단처
          </SubTitle>
          <InputWrapper>
            <Label isFirst>
              사진
            </Label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;

                if (file) {
                  convertFileToBase64(file, (base64Image : any) => {
                    setFormData({ ...formData, materialImage: base64Image });
                  });
                } else {
                  setFormData({ ...formData, materialImage: '' });
                }
              }}
            />
          </InputWrapper>
          {formData.materials.map((material: any, index: number)  => (
            <div key={index}>
              <SubSubTitle style={{ marginBottom : '1rem' }}>{`${index + 1} 원단처`}</SubSubTitle>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="*"
                  value={material.name || ''}
                  onChange={e => handleChange(e, 'materials', index, 'name')}
                  style={{ marginRight: '2rem' }}
                />
                <Input
                  type="text"
                  placeholder="호"
                  value={material.number || ''}
                  onChange={e => handleChange(e, 'materials', index, 'number')}
                  style={{ marginRight: '2rem' }}
                />
                <Input
                  type="text"
                  placeholder="전화번호"
                  value={material.phone || ''}
                  onChange={e => handleChange(e, 'materials', index, 'phone')}
                  style={{ marginRight: '2rem' }}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="작업사항"
                  value={material.task || ''}
                  onChange={e => handleChange(e, 'materials', index, 'task')}
                  style={{ marginRight: '2rem' }}
                />
                <TextArea
                  placeholder="@"
                  value={material.detailOne || ''}
                  onChange={e => handleChange(e, 'materials', index, 'detailOne')}
                  style={{ marginRight: '2rem' }}
                />
                <TextArea
                  placeholder="#"
                  value={material.detailTwo || ''}
                  onChange={e => handleChange(e, 'materials', index, 'detailTwo')}
                  style={{ marginRight: '2rem' }}
                />
                <Input
                  type="text"
                  placeholder="<>"
                  value={material.otherDetail || ''}
                  onChange={e => handleChange(e, 'materials', index, 'otherDetail')}
                  style={{ marginRight: '2rem' }}
                />
              </InputWrapper>
            </div>
          ))}
          <div style={{ display : 'flex', justifyContent : 'flex-end' }}>
            <button
              onClick={addMaterial}
              style={{ backgroundColor : 	'	#800080', color: 'white'  }}
            >
              + 원단처 추가
            </button>
            <button
              onClick={() => removeMaterial(formData.materials.length - 1)}
              style={{ backgroundColor : '#B22222', color: 'white', marginLeft: '1rem'  }}
            >
              -
            </button>
          </div>
          <Divider />
          <SubTitle>
            메인사진
          </SubTitle>
          <InputWrapper>
            <Label isFirst>
              사진
            </Label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;

                if (file) {
                  convertFileToBase64(file, (base64Image : any) => {
                    setFormData({ ...formData, mainImage: base64Image });
                  });
                } else {
                  setFormData({ ...formData, mainImage: '' });
                }
              }}
            />
          </InputWrapper>
          <SubSubTitle>
            원가 계산
          </SubSubTitle>
          <InputWrapper>
            <Label isFirst>
              공임
            </Label>
            <Input
              type="text"
              placeholder="가격"
              value={formatPrice(formData.laborCost)}
              onChange={e => {
                const newValue = e.target.value.replace(/,/g, '');
                setFormData({ ...formData, laborCost: newValue }); }}
            />
            <Label>
              시야게
            </Label>
            <Input
              type="text"
              placeholder="가격"
              value={formatPrice(formData.visibilityCost)}
              onChange={e =>
              { const newValue = e.target.value.replace(/,/g, '');
                setFormData({ ...formData, visibilityCost: newValue }); }}
            />
          </InputWrapper>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {
              formData.labors.map((labor: { cost?: string; price?: string }, index: number) => (
                <InputRow key={index}>
                  <InputWrapper>
                    <Input
                      type="text"
                      placeholder="단가 제목"
                      value={labor.cost || ''}
                      onChange={(e) => {
                        const newLabors = [...formData.labors];
                        const newLabor = { ...labor, cost: e.target.value };
                        newLabors[index] = newLabor;
                        setFormData({ ...formData, labors: newLabors });
                      }}
                      style={{ marginRight: '1rem', width: '100px' }}
                    />
                    <Input
                      type="text"
                      placeholder="가격"
                      value={labor.price && formatPrice(labor.price)}
                      onChange={(e) => {
                        const newLabors = [...formData.labors];
                        const newValue = e.target.value.replace(/,/g, '');
                        const newLabor = { ...labor, price: newValue };
                        newLabors[index] = newLabor;
                        setFormData({ ...formData, labors: newLabors });
                      }}
                    />
                  </InputWrapper>
                </InputRow>
              ))
            }
          </div>
          <div style={{ display : 'flex', justifyContent : 'flex-end' }}>
            <button
              onClick={addLaborInput}
              style={{ backgroundColor : 	'#800080', color: 'white'  }}
            >
              + 가격 항목 추가
            </button>
            <button
              onClick={() => removeLaborInput(formData.labors.length - 1)}
              style={{ backgroundColor : '#B22222', color: 'white', marginLeft: '1rem'  }}
            >
              -
            </button>
          </div>
          <SubSubTitle>
            원가 따로 계산
          </SubSubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop : '1rem' }}>
            {
              formData.costGroups.map((group : any, groupIndex : number) => (
                <div key={groupIndex}>
                  <Input
                    type="text"
                    placeholder="원가 계산 제목"
                    value={group.title}
                    onChange={(e) => {
                      const newCostGroups = [...formData.costGroups];
                      newCostGroups[groupIndex] = { ...group, title: e.target.value };
                      setFormData({ ...formData, costGroups: newCostGroups });
                    }}
                    style={{ marginBottom: '1rem' }}
                  />
                  {group.costs && group.costs.map((cost : any, costIndex : number) => (
                    <InputWrapper key={costIndex}>
                      <Input
                        type="text"
                        placeholder="비용 이름"
                        value={cost.name}
                        onChange={(e) => {
                          const newCostGroups = [...formData.costGroups];
                          newCostGroups[groupIndex].costs[costIndex] = { ...cost, name: e.target.value };
                          setFormData({ ...formData, costGroups: newCostGroups });
                        }}
                        style={{ marginRight: '1rem', width: '100px' }}
                      />
                      <Input
                        type="text"
                        placeholder="가격"
                        value={cost.price && formatPrice(cost.price)}
                        onChange={(e) => {
                          const newCostGroups = [...formData.costGroups];
                          newCostGroups[groupIndex].costs[costIndex] = { ...cost, price: e.target.value.replace(/,/g, '') };
                          setFormData({ ...formData, costGroups: newCostGroups });
                        }}
                      />
                    </InputWrapper>
                  ))}
                  <div style={{ display : 'flex', justifyContent : 'space-between' }}>
                    <button
                      onClick={() => addCostItem(groupIndex)}
                      style={{ backgroundColor : 	'	#800080', color: 'white'  }}
                    >
                      + 비용 항목 추가
                    </button>
                    <button
                      onClick={() => removeCostItem(groupIndex, group.costs.length - 1)}
                      style={{ backgroundColor : '#B22222', color: 'white', marginLeft: '1rem'  }}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ display : 'flex', justifyContent : 'flex-end' }}>
            <button
              onClick={addCostGroup}
              style={{ backgroundColor : 	'	#800080', color: 'white'  }}
            >
              + 원가 계산 추가
            </button>
            <button
              onClick={() => removeCostGroup()}
              style={{ backgroundColor : '#B22222', color: 'white', marginLeft: '1rem'  }}
            >
              -
            </button>
          </div>
          <Divider />
          <SubTitle>
            스와치
          </SubTitle>
          <SubSubTitle>
            출고수량
          </SubSubTitle>
          {formData.quantities.map((item : any, index : number) => (
            <InputWrapper key={index}>
              <Label isFirst>
                Color
              </Label>
              <Input
                type="text"
                value={item.color}
                onChange={e => handleChange(e, 'quantities', index, 'color')}
                placeholder="색상"
              />
              <Label>
                수량
              </Label>
              <Input
                type="text"
                value={item.quantity}
                onChange={e => handleChange(e, 'quantities', index, 'quantity')}
                placeholder="수량"
              />
            </InputWrapper>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={addQuantity}
              style={{ backgroundColor : 	'	#800080', color: 'white'  }}
            >
              + 스와치 추가
            </button>
            <button
              onClick={() => removeQuantity(formData.quantities.length - 1)}
              style={{ backgroundColor : '#B22222', color: 'white', marginLeft: '1rem'  }}
            >
              -
            </button>
          </div>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              style={{ marginTop: '100px', width: '300px', height: '50px', color: 'white', backgroundColor: 'green', fontSize: '20px', fontWeight: 'bold' }}
              onClick={componentSetHandler}
            >
              캡처
            </button>
          </div>
        </CreateContainer>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', width : '794px' }}>
            <button
              style={{ marginTop: '20px', width: '200px', height: '50px', color: 'white', backgroundColor: '#B22222', fontSize: '20px', fontWeight: 'bold' }}
              onClick={componentSetHandler}
            >
              돌아가기
            </button>
            {image !== null ? (
              <button
                style={{ marginTop: '20px', width: '200px', height: '50px', color: 'white', backgroundColor: 'green', fontSize: '20px', fontWeight: 'bold' }}
                onClick={() => downloadImage(image)}
              >
                이미지 다운로드
              </button>
            ) : (
              <button
                style={{ marginTop: '20px', width: '200px', height: '50px', color: 'black', backgroundColor: 'yellow', fontSize: '20px', fontWeight: 'bold' }}
                onClick={captureImage}
              >
                이미지 캡쳐
              </button>
            )}

          </div>
          <div
            style={{
              width: '794px',
              height: '1123px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
            }}
          >
            {image !== null ? (
              <img
                src={image}
                alt="form"
              />
            ) : (
              <div
                style={{
                  width: '794px',
                  height: '1123px',
                  backgroundColor: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem',
                }}
                ref={captureRef}
              >
                <Capture
                  formData={formData}
                />
              </div>
            )}

          </div>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const CreateContainer = styled.div`
    width: 48rem;
    margin: 7.5rem 0 11.25rem;
`;

const Title = styled.h1`
    display: flex;
    justify-content: center;
    font-size: 2.25rem;
    font-weight: 600;
    letter-spacing: -0.0225rem;
    cursor: text;
    margin-bottom: 3rem;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.015rem;
  cursor: text;
  margin-top: 2rem;
`;

const SubSubTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01125rem;
  cursor: text;
  margin-top: 1.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
`;

const Label = styled.label<{ isFirst?: boolean; }>`
  display: block;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: text;
  width: 5rem;
  margin-left: ${({ isFirst }) => isFirst ? 'none' : '1rem'};
`;

const Input = styled.input`
  width: 150px;
  height: 2rem;
  padding: 1rem 0.5rem;
  border: 0.125rem solid #d9d9d9;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 400;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 150px;
  height: 4rem;
  padding: 0 0.5rem;
  border: 0.125rem solid #d9d9d9;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 130%;
  cursor: text;
  outline: none;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d9d9d9;
  margin: 1rem 0;
`;
