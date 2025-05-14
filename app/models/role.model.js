export default (sequelize, Sequelize) => {
    const Role = sequelize.define('role', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    return Role;
};