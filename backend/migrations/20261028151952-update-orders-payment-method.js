
'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
            ALTER TABLE orders
            MODIFY COLUMN payment_method VARCHAR(50) NOT NULL
            DEFAULT 'cod'
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE orders
            MODIFY COLUMN payment_method
            ENUM('cashfree', 'razorpay', 'cod')
            NOT NULL DEFAULT 'cod'
        `);
    },

    async down(queryInterface) {
        // Retain all values to avoid breaking existing order records.
        await queryInterface.sequelize.query(`
            ALTER TABLE orders
            MODIFY COLUMN payment_method
            ENUM('cashfree', 'razorpay', 'cod')
            NOT NULL DEFAULT 'cod'
        `);
    }
};
