/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Form, Button, message } from 'antd'
import axios from 'axios'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import User from '../../Containers/userContainer'
import countryOptions from '../../Data/countryOptions'
import timezoneOptions from '../../Data/timezoneOptions'
import languageOptions from '../../Data/languageOptions'
import levelOptions from '../../Data/levelOptions'

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

const Edit = ({
  children, setEditing, initialValues, index
}) => {
  const [loading, setLoading] = useState(false)
  const user = User.useContainer()

  const onFinish = (values) => {
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

    // languages
    if (Object.keys(parameters).includes('language')) {
      const tempLanguages = [...user.user.languages]
      tempLanguages[index] = { level: parseInt(levelOptions.filter((e) => e.value === parameters.level)[0].key, 10), key: languageOptions.filter((e) => e.value === parameters.language)[0].key }
      if (tempLanguages.filter((e) => e.level === 7).length < 1) {
        message.error({
          content: 'Must have one native language',
          icon: <FaTimesCircle size={24} color="#e86461" style={{ marginRight: 10 }} />
        })
        setLoading(false)
        return
      }
      parameters = {
        languages: tempLanguages
      }
    }

    axios.post('http://localhost:9000/user/edit', parameters).then((data) => {
      setLoading(false)
      setEditing('')
      if (data.data.user) {
        user.setUser(data.data.user)
        message.success({
          content: 'Updated successfully',
          icon: <FaCheckCircle size={24} color="#1ae398" style={{ marginRight: 10 }} />
        })
      } else {
        message.error({
          content: 'Update failed',
          icon: <FaTimesCircle size={24} color="#e86461" style={{ marginRight: 10 }} />
        })
      }
    }).catch(() => {
      message.error({
        content: 'Update failed',
        icon: <FaTimesCircle size={24} color="#e86461" style={{ marginRight: 10 }} />
      })
      setLoading(false)
    })
  }

  const onFinishFailed = () => {

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
