import sequelize from './config/sequelize.js';

const run = async () => {
  // NOTE: assumes MySQL is configured and models are using the same sequelize instance.
  // We'll query the underlying `products` table directly.
  const [countRows] = await sequelize.query('SELECT COUNT(*) AS cnt FROM products;');
  const cnt = countRows?.[0]?.cnt;

  const [groupRows] = await sequelize.query('SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY cnt DESC;');

  console.log(JSON.stringify({ totalProducts: cnt, categories: groupRows }, null, 2));
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

