const Post = require('../models/Post');
const Tag = require('../models/Tag');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image or video! Please upload only images or videos.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// // Create a new post with media support
// const createPost = async (req, res) => {
//     try {
//         const { title, content, tags } = req.body;
//         const files = req.files;
//         const userId = req.user._id;

//         // Handle tags
//         const tagsArray = Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [];
//         const tagIds = await Promise.all(tagsArray.map(async (tagName) => {
//             let tag = await Tag.findOne({ name: tagName });
//             if (!tag) {
//                 tag = await Tag.create({ name: tagName });
//             }
//             return tag._id;
//         }));

//         // Initialize post data
//         const postData = {
//             title,
//             content,
//             author: userId,
//             tags: tagIds,
//             contentType: 'text'
//         };

//         // Handle media uploads
//         if (files && files.length > 0) {
//             const mediaUrls = [];
            
//             for (const file of files) {
//                 const isVideo = file.mimetype.startsWith('video/');
                
//                 const result = await cloudinary.uploader.upload(file.path, {
//                     resource_type: isVideo ? 'video' : 'image',
//                     folder: 'posts'
//                 });

//                 mediaUrls.push({
//                     url: result.secure_url,
//                     type: isVideo ? 'video' : 'image'
//                 });
//             }

//             postData.mediaUrls = mediaUrls;
//             postData.contentType = mediaUrls[0].type;
//         }

//         const post = await Post.create(postData);

//         // Add post to user's posts array
//         await User.findByIdAndUpdate(
//             userId,
//             { $push: { posts: post._id } }
//         );

//         // Populate the created post
//         const populatedPost = await Post.findById(post._id)
//             .populate('author', 'name profilePicture')
//             .populate('tags', 'name');

//         res.status(201).json({
//             success: true,
//             data: populatedPost
//         });
//     } catch (error) {
//         console.error('Error creating post:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .populate('tags')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email')
             .populate('tags', 'name');
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// // Update a post
// const updatePost = async (req, res) => {
//     try {
//         const { title, content, tags } = req.body;
//         const files = req.files;
//         const userId = req.user._id;

//         let updateData = { title, content };

//         // Handle tags if provided
//         if (tags) {
//             const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
//             const tagIds = await Promise.all(tagsArray.map(async (tagName) => {
//                 let tag = await Tag.findOne({ name: tagName });
//                 if (!tag) {
//                     tag = await Tag.create({ name: tagName });
//                 }
//                 return tag._id;
//             }));
//             updateData.tags = tagIds;
//         }

//         // Handle media uploads
//         if (files && files.length > 0) {
//             const mediaUrls = [];
            
//             for (const file of files) {
//                 const isVideo = file.mimetype.startsWith('video/');
                
//                 const result = await cloudinary.uploader.upload(file.path, {
//                     resource_type: isVideo ? 'video' : 'image',
//                     folder: 'posts'
//                 });

//                 mediaUrls.push({
//                     url: result.secure_url,
//                     type: isVideo ? 'video' : 'image'
//                 });
//             }

//             updateData.mediaUrls = mediaUrls;
//             updateData.contentType = mediaUrls[0].type;
//         }

//         const post = await Post.findOneAndUpdate(
//             { _id: req.params.id, author: userId },
//             updateData,
//             { new: true, runValidators: true }
//         ).populate('author', 'name profilePicture')
//          .populate('tags', 'name');

//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Post not found or unauthorized'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: post
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// Delete a post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Get posts for a specific user
const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;

        const posts = await Post.find({ author: userId })
            .populate('author', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts,
            count: posts.length
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get posts by tag
const getPostsByTag = async (req, res) => {
    try {
        const { tagName } = req.params;

        // First find the tag
        const tag = await Tag.findOne({ name: tagName });
        
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }

        // Find posts that have this tag
        const posts = await Post.find({ tags: tag._id })
            .populate('author', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts,
            count: posts.length
        });

    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new post with express-fileupload
const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const files = req.files;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        // Handle tags
        let tagIds = [];
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
            tagIds = await Promise.all(tagsArray.map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag._id;
            }));
        }

        // Initialize post data
        const postData = {
            title,
            content,
            author: userId,
            tags: tagIds,
            contentType: 'text'
        };

        // Handle media uploads
        if (files && files.media) {
            const mediaFiles = Array.isArray(files.media) ? files.media : [files.media];
            const mediaUrls = [];
            
            for (const file of mediaFiles) {
                const isVideo = file.mimetype.startsWith('video/');
                
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    resource_type: isVideo ? 'video' : 'image',
                    folder: 'posts'
                });

                mediaUrls.push({
                    url: result.secure_url,
                    type: isVideo ? 'video' : 'image'
                });
            }

            postData.mediaUrls = mediaUrls;
            postData.contentType = mediaUrls[0].type;
        }

        const post = await Post.create(postData);
        await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

        const populatedPost = await Post.findById(post._id)
            .populate('author', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name profilePicture' }
            });

        res.status(201).json({
            success: true,
            data: populatedPost
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a post with express-fileupload
const updatePost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const files = req.files;
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findOne({ _id: postId, author: userId });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        if (title) post.title = title;
        if (content) post.content = content;

        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
            const tagIds = await Promise.all(tagsArray.map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag._id;
            }));
            post.tags = tagIds;
        }

        if (files && files.media) {
            const mediaFiles = Array.isArray(files.media) ? files.media : [files.media];
            const mediaUrls = [];
            
            for (const file of mediaFiles) {
                const isVideo = file.mimetype.startsWith('video/');
                
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    resource_type: isVideo ? 'video' : 'image',
                    folder: 'posts'
                });

                mediaUrls.push({
                    url: result.secure_url,
                    type: isVideo ? 'video' : 'image'
                });
            }

            post.mediaUrls = mediaUrls;
            post.contentType = mediaUrls[0].type;
        }

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('author', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name profilePicture' }
            });

        res.status(200).json({
            success: true,
            data: updatedPost
        });

    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    // createPost: [upload.array('media', 5), createPost],
    getAllPosts,
    getPostById,
    // updatePost: [upload.array('media', 5), updatePost],
    deletePost,
    getUserPosts,
    getPostsByTag,
    createPost,
    updatePost
};
