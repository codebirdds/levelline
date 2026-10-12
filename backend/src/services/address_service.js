
const db = require('../models');
const Address = db.Address;

const ADDRESS_FIELDS = [
  'full_name',
  'phone',
  'address_line1',
  'building_name',
  'floor',
  'address_line2',
  'landmark',
  'delivery_instructions',
  'city',
  'state',
  'postal_code',
  'country',
  'address_type'
];

class AddressService {

  // CREATE
  async create(data, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const count = await Address.count({
        where: { user_id: userId },
        transaction
      });

      const shouldBeDefault =
        data.is_default === true ||
        data.is_default === 'true' ||
        count === 0;

      if (shouldBeDefault) {
        await Address.update(
          { is_default: false },
          {
            where: { user_id: userId },
            transaction
          }
        );
      }

      const addressData = {};

      ADDRESS_FIELDS.forEach(field => {
        if (data[field] !== undefined) {
          addressData[field] = data[field];
        }
      });

      const address = await Address.create(
        {
          ...addressData,
          user_id: userId,
          is_default: shouldBeDefault
        },
        { transaction }
      );

      await transaction.commit();
      return address;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // GET ALL
  async findAll(userId) {
    return await Address.findAll({
      where: { user_id: userId },
      order: [
        ['is_default', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
  }

  // GET BY ID
  async findById(id, userId) {
    const address = await Address.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }

  // UPDATE
  async update(id, data, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const address = await Address.findOne({
        where: {
          id,
          user_id: userId
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!address) {
        throw new Error('Address not found');
      }

      const updateData = {};

      ADDRESS_FIELDS.forEach(field => {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      });

      const wantsDefault =
        data.is_default === true ||
        data.is_default === 'true';

      if (wantsDefault) {
        await Address.update(
          { is_default: false },
          {
            where: { user_id: userId },
            transaction
          }
        );

        updateData.is_default = true;
      }

      // Don't allow an update to unset the current default directly.
      // Use the set-default endpoint to choose another address.
      await address.update(updateData, { transaction });

      await transaction.commit();

      return await this.findById(id, userId);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // DELETE
  async delete(id, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const address = await Address.findOne({
        where: {
          id,
          user_id: userId
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!address) {
        throw new Error('Address not found');
      }

      const wasDefault = address.is_default;

      await address.destroy({ transaction });

      // Promote another address if the default was deleted.
      if (wasDefault) {
        const nextAddress = await Address.findOne({
          where: { user_id: userId },
          order: [['createdAt', 'DESC']],
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (nextAddress) {
          await nextAddress.update(
            { is_default: true },
            { transaction }
          );
        }
      }

      await transaction.commit();
      return true;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // SET DEFAULT
  async setDefault(id, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const address = await Address.findOne({
        where: {
          id,
          user_id: userId
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!address) {
        throw new Error('Address not found');
      }

      await Address.update(
        { is_default: false },
        {
          where: { user_id: userId },
          transaction
        }
      );

      await address.update(
        { is_default: true },
        { transaction }
      );

      await transaction.commit();

      return await this.findById(id, userId);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new AddressService();
