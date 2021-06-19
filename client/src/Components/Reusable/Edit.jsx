/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Form, Button } from 'antd'
import axios from 'axios'
import User from '../../Containers/userContainer'
import countryOptions from '../../Data/countryOptions'
import timezoneOptions from '../../Data/timezoneOptions'

const EditingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    @media screen and (max-width: 768px) {
        margin-top: 10px;
    }
`

const EditingRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 200px;
`

const InputRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const Edit = ({ children, setEditing, initialValues }) => {
  const [loading, setLoading] = useState(false)
  const user = User.useContainer()

  const onFinish = (values) => {
    console.log(values)
    setLoading(true)
    let parameters = values

    // date of birth
    if (Object.keys(parameters).includes('day', 'month', 'year')) {
      parameters = {
        dob: { ...parameters }
      }
    }

    // countries
    if (Object.keys(parameters).includes('country')) {
      parameters = {
        country: countryOptions.filter((e) => e.value === values.country)[0].key,
      }
    }

    if (Object.keys(parameters).includes('living')) {
      parameters = {
        living: countryOptions.filter((e) => e.value === values.living)[0].key,
      }
    }

    // timezones
    if (Object.keys(parameters).includes('timezone')) {
      parameters = {
        timezone: timezoneOptions.filter((e) => e.value === values.timezone)[0].key,
      }
    }

    axios.post('http://localhost:9000/user/edit', parameters).then((data) => {
      setLoading(false)
      setEditing('')
      if (data.data.user) {
        user.setUser(data.data.user)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const onFinishFailed = () => {
    console.log('finish failed')
  }

  return (
    <Form
      name="edit"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ width: '100%' }}
    >
      <EditingContainer>
        <InputRow>
          {children}
        </InputRow>
        <EditingRow>
          <Form.Item style={{ width: '100%', paddingRight: 5 }}>
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                setEditing('')
              }}
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item style={{ width: '100%', paddingLeft: 5 }}>
            <Button type="primary" style={{ width: '100%' }} htmlType="submit" loading={loading}>Save</Button>
          </Form.Item>
        </EditingRow>
      </EditingContainer>
    </Form>
  )
}

export default Edit
