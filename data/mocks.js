import faker from 'faker'

const mocks = {
  url: () => ({ foo: 'bar' }),
  String: () => faker.lorem.words(),
  PullRequest: () => ({
    createdAt: () => faker.date.past().toISOString(),
    updatedAt: () => faker.date.past().toISOString()
  })
}

export default mocks
