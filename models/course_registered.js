module.exports = (sequelize, DataTypes) => {
    const course_registered = sequelize.define('course_registered', {
        course_registered_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        registered_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    course_registered.belongsTo(sequelize.models.courses, { foreignKey: 'course_id' }); // Assuming Course is the name of your Course schema
    course_registered.belongsTo(sequelize.models.users, { foreignKey: 'user_id' }); // Assuming Course is the name of your Course schema

    return course_registered;
}
