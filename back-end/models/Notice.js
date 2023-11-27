"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Notice = sequelize.define("Notices", {
        noticeId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        noticeType: {
            type: DataTypes.STRING,
            validate: {
                isIn: [["spl1", "spl2", "spl3", "public"]],
            },
            comment: "committee creation, presentation event",
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
    });

    return Notice;
};
