const Prisma = require('../lib/prisma');
const { jwtDecode } = require("jwt-decode");

module.exports.getAllPosts = async (req, res) => {
    const query = req.query;
    // console.log(query);
    const city = query.city ? query.city.toLowerCase() : undefined;

    query.type == 'any' ? query.type = undefined : query.type;
    query.property == 'any' ? query.property = undefined : query.property;
    const bed = query.bed && query.bed !== 'undefined' ? parseInt(query.bed) : undefined;

    try {
        const allPosts = await Prisma.post.findMany({
            where: {
                city: city || undefined,
                price: {
                    gt: parseInt(query.min) || undefined,
                    lt: parseInt(query.max) || undefined
                },
                type: query.type,
                property: query.property,
                bed
            }
        });
        res.status(200).json({
            allPosts,
            message: "All posts fetched"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Invalid Request",
        })
    }
}

module.exports.getUserPosts = async (req, res) => {
    const token = req.cookies.token;
    const { id } = jwtDecode(token);
    try {
        const post = await Prisma.post.findMany({
            where: {
                userId: id
            }
        });

        res.status(200).json({
            post,
            message: "All posts are fetched"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "An error occurred while fetching posts"
        })
    }
}

module.exports.getSavedPosts = async (req, res) => {
    const { id } = req.params;
    try {
        const bookmarks = await Prisma.Bookmark.findMany({
            where: {
                userId: id
            },
            include: {
                post: true
            }
        })

        console.log(bookmarks);

        res.status(200).json({
            bookmarks,
            message: "Saved Posts are successfully fetched"
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Unable to fetch Saved Posts"
        })
    }
}

module.exports.createPost = async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;
    const { username } = jwtDecode(token);

    console.log(username , `token`);
    console.log(id);

    try {
        // const { price, title, address, bath, bed, longitude, latitude, city, type, property, detail, images } = req.body;
        // console.log(price, title, address, bath, bed, longitude, latitude, city, type, property, detail, images);
        const all = req.body;
        const { price, bed, bath, city } = all;
        const parseIntPrice = parseInt(price);
        const parseIntBed = parseInt(bed);
        const parseIntBath = parseInt(bath);
        const cityLowerCase = city.toLowerCase();
        // console.log(cityLowerCase);
        // console.log(all);

        const post = await Prisma.post.create({
            data: {
                ...all,
                postedBy: username,
                userId: id,
                price: parseIntPrice,
                bed: parseIntBed,
                bath: parseIntBath,
                city: cityLowerCase
            }
        })

        if (!post) return res.status(400).json({
            message: "An error occurred while creating post"
        })

        return res.status(200).json({
            message: "Post created successfully",
            post
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "An error occurred while creating post"
        })
    }
}

module.exports.getPost = async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;
    console.log(token);
    const { id: userId } = jwtDecode(token);

    try {
        const post = await Prisma.post.findUnique({
            where: {
                id
            },
            include: {
                bookmarks: true
            }
        })

        let isBookmark = false;

        post.bookmarks.map((post) => {
            if (post.userId === userId && post.postId === id) {
                isBookmark = true;
                return;
            }
        })

        res.status(200).json({
            post,
            isBookmark,
            message: 'Property Fetched'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Unable to fetch the property'
        })
    }
}

module.exports.deletePost = async (req, res) => {

}