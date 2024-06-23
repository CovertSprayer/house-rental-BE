const { jwtDecode } = require("jwt-decode");
const prisma = require("../lib/prisma");

module.exports.save = async (req, res) => {
    const { postId } = req.params;
    const token = req.cookies.token;
    const { id: userId } = jwtDecode(token);

    console.log(postId);
    console.log(userId);

    try {
        const isBookmarked = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        })

        if (isBookmarked) {
            await prisma.bookmark.delete({
                where: {
                    id: isBookmarked.id
                }
            })
            return res.status(200).json({
                message: `Property removed from Saved Lists`,
                bookmark: false
            })
        } else {
            await prisma.bookmark.create({
                data: {
                    postId,
                    userId,
                }

            })
            return res.status(200).json({
                message: 'Property Saved',
                bookmark: true
            })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Error occurred while saving post'
        })
    }
}