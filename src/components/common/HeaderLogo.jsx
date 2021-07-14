import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Logo from '@img/logo.svg'

const HeaderLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`

const Title = styled.p`
    font-size: 2em;
    font-weight: 700;
    margin-right: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 5px;
    color: ${(p) => (p.light ? '#fff' : '#000')};
`

export default ({ light }) => {
  const history = useHistory()
  return (
    <HeaderLogo onClick={() => {
      history.push('/')
    }}
    >
      <img src={Logo} style={{ height: 36, width: 36 }} alt="logo" />
      <Title light={light}>dialect</Title>
    </HeaderLogo>
  )
}
