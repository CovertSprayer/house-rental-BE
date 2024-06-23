const Prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

module.exports.getUsers = async (req, res) => {
    try {
        const users = await Prisma.user.findMany()
        res.status(200).json({ message: 'Success', users })
    } catch (err) {
        res.status(400).json({ message: "An error occurred in fetching all users" })
    }
}

module.exports.getUser = async (req, res) => {
    const userId = req.params;
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: userId.id,
            },
            include: {
                bookmarks: true
            }
        })
        if (!user) return res.status(403).json({ message: 'No such user exists' });
        // console.log(user);

        res.status(200).json({ message: 'Success', user });
    } catch (err) {
        res.status(400).json({ message: "An error occurred in fetching all users" })
    }
}

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, avatar } = req.body;
    console.log(username, password, email, avatar);

    let hashedPass = null;
    if (password) {
        hashedPass = await bcrypt.hash(password, 10);
    }

    try {
        const updateUser = await Prisma.user.update({
            where: {
                id,
            },
            data: {
                username,
                email,
                password: hashedPass,
                avatar
            },
        })

        const { password, ...user } = updateUser;
        console.log(user);
        res.status(200).json({ message: 'User updated successfully', user })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'An error occurred' })
    }
}

module.exports.deleteUser = async (req, res) => {
    const userId = req.params;
    try {
        const deletedUser = await Prisma.user.delete({
            where: {
                id: userId.id,
            },
        })

        res.status(200).json({ message: 'Succesfully deleted the user', deletedUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'An error occurred in deleting the user' });
    }
}

