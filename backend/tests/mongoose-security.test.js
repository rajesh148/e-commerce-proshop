import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

// Exercise query execution without connecting to a real database.
function fixture() {
  const instance = new mongoose.Mongoose();
  const Model = instance.model('SecurityProbe', new instance.Schema({ email: String }));
  const filters = [];
  Model.collection.countDocuments = async filter => {
    filters.push(filter);
    return 1;
  };
  return { Model, filters };
}

test('countDocuments rejects selector injection when sanitizeFilter is enabled', async () => {
  const { Model, filters } = fixture();
  await assert.rejects(
    Model.countDocuments({ email: { $ne: null } }).setOptions({ sanitizeFilter: true }).exec(),
    { name: 'CastError' }
  );
  assert.equal(filters.length, 0);
});

test('countDocuments preserves a legitimate equality filter', async () => {
  const { Model, filters } = fixture();
  assert.equal(await Model.countDocuments({ email: 'person@example.com' })
    .setOptions({ sanitizeFilter: true }).exec(), 1);
  assert.deepEqual(filters, [{ email: 'person@example.com' }]);
});

test('application models load and validate with the updated dependency', async () => {
  const [{ default: User }, { default: Product }, { default: Order }] = await Promise.all([
    import('../models/userModel.js'), import('../models/productModel.js'), import('../models/orderModel.js')
  ]);
  await new User({ name: 'Test', email: 'test@example.com', password: 'test-password' }).validate();
  assert.equal(Product.modelName, 'Product');
  assert.equal(Order.modelName, 'Order');
});
