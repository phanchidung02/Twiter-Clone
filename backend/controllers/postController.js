import User from '../model/userModel.js';
import Post from './../model/postModel.js';
import Notification from '../model/notificationModel.js';
import { v2 as cloudinary } from 'cloudinary';
async function createPost(req, res) {
  try {
    const { text } = req.body;
    let { image } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    if (!text && !image) {
      return res.status(400).json({
        status: 'fail',
        message: 'Post must have text or image',
      });
    }

    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image);
      image = uploadImg.secure_url;
    }
    const newPost = new Post({
      user: req.user._id,
      text,
      image,
    });

    await newPost.save();

    return res.status(201).json({
      status: 'success',
      data: newPost,
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function editPost(req, res) {
  try {
    const { id } = req.params;
    const updated = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not authorized edit post',
      });
    }

    if (updated.image) {
      if (post.image) {
        await cloudinary.uploader.destroy(
          post.image.split('/').pop().split('.')[0]
        );
      }
      const uploadProfileImg = await cloudinary.uploader.upload(updated.image);
      updated.image = uploadProfileImg.secure_url;
    }
    const postAfterUpdate = await Post.findByIdAndUpdate(id, updated, {
      new: true,
    });
    return res.status(201).json({
      status: 'success',
      data: [postAfterUpdate],
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not authorized to delete post',
      });
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function commentOnPost(req, res) {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const { postId } = req.params;

    if (!text) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please input text',
      });
    }

    const post = await Post.findById(postId);

    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Not found post',
      });

    const comment = { text, user: userId };
    post.comments.push(comment);
    await post.save();

    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function editComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const updated = req.body;
    if (!updated.text)
      return res.status(400).json({
        status: 'fail',
        message: 'Please input text',
      });
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    console.log(comment);
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'fail',
        message: 'You not authorized edit this comment',
      });
    }

    comment.text = updated.text;
    await post.save();

    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (post.user.toString() === req.user._id.toString()) {
      post.comments.pull(commentId);
    } else if (comment.user.toString() === req.user._id.toString()) {
      post.comments.pull(commentId);
    } else {
      return res.status(401).json({
        status: 'fail',
        message: 'You not authorized delete this comment',
      });
    }

    await post.save();

    return res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function likeAndUnlikePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    const checkIsLiked = post.likes.includes(userId);
    if (checkIsLiked) {
      post.likes.pull(userId);
      user.likedPost.pull(id);
      const newNotification = new Notification({
        from: userId,
        to: post.user._id,
        type: 'unlike',
      });
      await newNotification.save();
    } else {
      post.likes.push(userId);
      user.likedPost.push(id);
      const newNotification = new Notification({
        from: userId,
        to: post.user._id,
        type: 'like',
      });
      await newNotification.save();
    }

    await post.save();
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: checkIsLiked ? 'unlike' : 'like',
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function getAllPost(req, res) {
  try {
    const post = await Post.find()
      .sort({
        createdAt: -1,
      })
      .populate('user', 'fullName username profileImg')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username fullName profileImg -_id',
        },
      });

    if (!post)
      return res.status(404).json({
        status: 'fail',
        message: 'Not found',
      });

    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function getLikedPost(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    const likedPost = await Post.find({
      _id: { $in: user.likedPost },
    })
      .populate({
        path: 'user',
        select: 'username fullName profileImg -_id',
      })
      .populate({
        path: 'comments.user',
        select: 'username fullName profileImg',
      });
    return res.json(likedPost);
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function getFollowingPost(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'username fullName profileImg -_id',
      })
      .populate({
        path: 'comments.user',
        select: 'username fullName profileImg',
      });

    return res.status(200).json({
      status: 'success',
      data: feedPosts,
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}

async function getUserPost(req, res) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    const post = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'username fullName profileImg -_id',
      })
      .populate({
        path: 'comments.user',
        select: 'username fullName profileImg',
      });

    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (err) {
    console.log(`Error in postController: ${err.message}`);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
}
export {
  createPost,
  editPost,
  deletePost,
  commentOnPost,
  editComment,
  deleteComment,
  likeAndUnlikePost,
  getAllPost,
  getLikedPost,
  getFollowingPost,
  getUserPost,
};
