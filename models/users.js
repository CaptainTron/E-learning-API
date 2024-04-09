module.exports = (sequelize, DataTypes) => {
    const register = sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return register;
}