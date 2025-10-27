const bcrypt = require('bcrypt');

const passwordUtils = {
    hashPassword: async (password) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    }
};

module.exports = passwordUtils;