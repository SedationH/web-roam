import request from 'umi-request'

const getRemote = async () => {
  try {
    const result = await request('api/users', {
      method: 'get',
    })

    return result.data
  } catch (error) {
    console.log(error)
  }
}

const editRemote = async ({ id, data }) => {
  console.log(id, data)
  try {
    await request(
      `http://public-api-v1.aspirantzhang.com/users/${id}`,
      {
        method: 'put',
        data,
      },
    )
  } catch (error) {
    console.log(error)
  }
}

export { getRemote, editRemote }
