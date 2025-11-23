const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@appTypes': path.resolve(__dirname, 'src/types'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@appTypes$': '<rootDir>/src/types/index',
        '^@appTypes/(.*)$': '<rootDir>/src/types/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      },
    },
  },
};

