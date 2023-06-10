"use strict";

export default (sequelize, DataTypes) => {
    const OTP = sequelize.define("OTPs", {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: "Users",
                key: "email",
            },
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    OTP.associate = (models) => {
        // User - OTP [one to one]
        OTP.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "email",
        });
    };

    return OTP;
};
