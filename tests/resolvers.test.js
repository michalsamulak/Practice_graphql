const resolvers = require('../src/resolvers')

describe('resolvers', () => {
  test('feed', () => {
    const result = resolvers.Query.feed(null, null, {
      module: {
        Post: {
          findMany() {
            return ['resolvers', 'feed']
          }
        }
      }
    })
    expect(result).toEqual(['resolvers', 'feed'])
  })
})