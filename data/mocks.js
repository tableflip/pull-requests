import faker from 'faker'

const mocks = {
  String: () => faker.lorem.words()
}

export default mocks
