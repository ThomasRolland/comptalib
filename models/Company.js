'use strict';

/**
 * @swagger
 * definitions:
 *   Company:
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
    const company = sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type:			DataTypes.STRING,
            allowNull: 		false,
            unique: {
                args: 		true,
                msg: 		"name (for company) already exists"
            }
        },
        zipCode: {
            type:			DataTypes.INTEGER,
            allowNull: 		true,
        }
    });
    company.associate = (models) => {
        company.belongsToMany(models.User, {through: "CompanyUser"})
    }
    return company;
}
