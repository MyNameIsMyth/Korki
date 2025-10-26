const bcrypt = require('bcryptjs');

const passwordUtils = {
    // Хеширование пароля
    hashPassword: async (password) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    // Проверка пароля
    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    }
};

module.exports = passwordUtils;