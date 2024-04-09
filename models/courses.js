module.exports = (sequelize, DataTypes) => {
    const Courses = sequelize.define('courses', {
        course_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pre_requisites: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        certification: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        Ratings: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Define an array of strings for tags
            allowNull: true,
            defaultValue: [] // Default value is an empty array
        }
    });

    Courses.beforeSave((course, options) => {
        if (course.tags && Array.isArray(course.tags)) {
            course.tags = course.tags.filter(tag => tag);
        }
    });


    return Courses;
}
