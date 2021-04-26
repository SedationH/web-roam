import React, { useState } from 'react'
import { Table, Space } from 'antd'
import { connect } from 'umi'
import UserModal from '../components/UserModal'

const Index = ({ users, dispatch }) => {
  const [modalVisibal, setModalVisibal] = useState(false)
  const [record, setRecord] = useState(null)

  const handleEdit = record => {
    setRecord(record)
    setModalVisibal(true)
  }

  const handleModalOk = () => {
    setModalVisibal(false)
  }

  const handleModalCancel = () => {
    setModalVisibal(false)
  }

  const onFinish = values => {
    handleModalOk()
    dispatch({
      type: 'users/editRemote',
      payload: {
        data: values,
        id: record.id,
      },
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CreateTime',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]

  return (
    <div className="list-table">
      <Table
        columns={columns}
        dataSource={users.data}
        rowKey="id"
      />
      <UserModal
        modalVisibal={modalVisibal}
        handleModalCancel={handleModalCancel}
        record={record}
        onFinish={onFinish}
      />
    </div>
  )
}

const mapStateToProps = ({ users }) => ({
  users,
})
export default connect(mapStateToProps)(Index)
