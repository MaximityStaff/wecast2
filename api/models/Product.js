module.exports = {
  identity: 'product',
  attributes: {
    ad: {
      type: 'string',
      required: true
    },
    pid: {
      type: 'integer',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string'
    },
    category: {
      type: 'string',
      defaultsTo: '其他'
    },
    tag: {
      type: 'array',
      defaultsTo: []
    },
    specification: {
      type: 'array',
      defaultsTo: []
    },
    imgUrl: {
      type: 'string'
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};