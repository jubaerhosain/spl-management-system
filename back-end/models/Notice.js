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
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
        type: {
            type: DataTypes.STRING(8),
            validate: {
                isIn: [["spl1", "spl2", "spl3", "public"]],
            },
            comment: "committee creation, presentation event date",
        },
    });

    return Notice;
};
