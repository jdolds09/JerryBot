const joke = require('../index.js');

test('can fetch a random joke', async() => {
  let returnedJoke = await joke.getRandomJoke();
  expect(typeof returnedJoke).toBe('string');
});