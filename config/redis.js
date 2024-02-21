const { createClient } = require("redis");

module.exports = {
  redisClientInit: async () => {
    const client = await createClient(6379);

    client.on("error", function (error) {
      console.error(error);
    });

    await client.connect();

    return client;
  }
};
