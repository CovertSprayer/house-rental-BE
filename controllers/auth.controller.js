const bcrypt = require('bcrypt');
const Prisma = require('../lib/prisma');

// JWT for creating tokens
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).json({
                message: "Please fill all fields"
            })
        }

        const userExists = await Prisma.user.findUnique({
            where: {
                username
            }
        })

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const emailExists = await Prisma.user.findUnique({
            where: {
                email
            }
        })

        if (emailExists) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);
        console.log(username, hashedPass, email);

        // Save to database with prisma
        const user = await Prisma.user.create({
            data: {
                username,
                password: hashedPass,
                email
            }
        })


        res.status(200).json({
            message: "User Registered Successfully",
            username,
            email
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({
                message: "Please enter all fields"
            })
        }

        const user = await Prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            message: "Logged In",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Try Again"
        })
    }
}

module.exports.logout = (req, res) => {
    try {
        console.log(`cookie delete`);
        return res.clearCookie("token").status(200).json({
            message: "Logout Successful"
        });
    } catch (error) {
        return res.status(404).json({
            message: "An error occurred"
        })
    }
}