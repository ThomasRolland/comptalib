'use strict';

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *         required: true
 *       zipCode:
 *         type: integer
 *         required: false
 */

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type:			DataTypes.STRING,
            allowNull: 		false,
        },
        password: {
            type:			DataTypes.INTEGER,
            allowNull: 		true,
        }
    });
    user.associate = (models) => {
        user.belongsToMany(models.Company, {through: "CompanyUser"})
    }
    return user;
}
