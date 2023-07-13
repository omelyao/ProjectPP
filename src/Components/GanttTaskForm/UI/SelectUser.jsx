import React from 'react';
import styled from 'styled-components';
import shape from "../../../assets/img/shape.svg"
import {useRecoilValue} from "recoil";
import {projectInterns} from "../../../store/atom";
import {useParams} from "react-router-dom";
import {useGetUserQuery} from "../../../redux/authApi";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

// const IconWrapper = styled.div`
//   position: absolute;
// `;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
`;

const SelectItem = styled.span`
  //position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 184px;
  height: 32px;
  border: 1px solid #AFBAC3;
  background: #FFFFFF;
  border-radius: 5px;
  padding: 0 8px;
  font-size: 14px;
  text-overflow: ellipsis;
`;

const Option = styled.span`
  font-size: 1rem;
`;

const SelectUser = ({label}) =>
{
    const {userId} = useParams();
    const user = useGetUserQuery({id: userId});
    return (
        <Wrapper>
            {label && <Label>{label}</Label>}
            <SelectItem defaultValue={user.id} disabled>
                {`${user.data.last_name} ${user.data.first_name}`}
            </SelectItem>
        </Wrapper>
    );
}
;

export default SelectUser;
