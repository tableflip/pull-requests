import faker from 'faker'

const mocks = {
  String: () => faker.lorem.words(),
  Url: () => faker.internet.avatar()
}

export default mocks
