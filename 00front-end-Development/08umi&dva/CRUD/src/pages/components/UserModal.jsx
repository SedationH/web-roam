import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input } from 'antd'

export default ({
  modalVisibal,
  handleModalOk,
  handleModalCancel,
  record,
  onFinish,
}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(record)
  }, [modalVisibal])

  const onOk = () => {
    form.submit()
    handleModalOk()
  }

  const onFinishFailed = ({
    values,
    errorFields,
    outOfDate,
  }) => {
    console.log('error', arguments)
  }

  return (
    <Modal
      title="Basic Modal"
      visible={modalVisibal}
      onOk={onOk}
      onCancel={handleModalCancel}
      forceRender
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Create Time" name="create_time">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
