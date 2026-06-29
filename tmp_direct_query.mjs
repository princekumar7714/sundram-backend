import sequelize from './config/sequelize.js';

const run = async () => {
  const urlCategory = process.argv[2] || 'seeds';
  const res = await sequelize.query(
    `SELECT id, name, category, price, stock FROM products WHERE LOWER(category) = LOWER(:cat) LIMIT 10;`,
    { replacements: { cat: urlCategory }, type: sequelize.QueryTypes.SELECT }
  );
  console.log('Direct LOWER(category)=LOWER(:cat) results count:', res.length);
  console.log(res);
};

run().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});

