module.exports = (sequelize, DataTypes) => {
    const Courses = sequelize.define('courses', {
        course_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Courses;
}
