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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'user_course'
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'user_course'
        }
    }); 

    course_registered.belongsTo(sequelize.models.courses, { foreignKey: 'course_id' }); 
    course_registered.belongsTo(sequelize.models.user, { foreignKey: 'user_id' }); 

    return course_registered;
}
 