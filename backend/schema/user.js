const userSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 30 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    isVerified: { type: 'boolean' }
  },
  required: ['username', 'email', 'password'],
  additionalProperties: false,
};

export {
  userSchema
};
