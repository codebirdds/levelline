
'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
            ALTER TABLE payments
            MODIFY COLUMN payment_method VARCHAR(50) NOT NULL
            DEFAULT 'cashfree'
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE payments
            MODIFY COLUMN payment_method
            ENUM('cashfree', 'cod', 'razorpay')
            NOT NULL DEFAULT 'cashfree'
        `);
    },

    async down(queryInterface) {
        // Keep all supported values to protect existing records.
        await queryInterface.sequelize.query(`
            ALTER TABLE payments
            MODIFY COLUMN payment_method
            ENUM('cashfree', 'cod', 'razorpay')
            NOT NULL DEFAULT 'cashfree'
        `);
    }
};
