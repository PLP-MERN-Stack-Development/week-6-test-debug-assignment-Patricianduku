const { createPost, getPosts, updatePost, deletePost } = require('../../controllers/postController');
const Post = require('../../models/Post');

jest.mock('../../models/Post');

describe('postController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Post',
        content: 'Test content',
        category: 'category123',
      },
      user: {
        id: 'user123',
      },
      params: {
        id: 'post123',
      },
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should create a new post', async () => {
    const savedPost = {
      ...req.body,
      author: req.user.id,
      slug: 'test-post',
    };

    Post.create.mockResolvedValue(savedPost);

    await createPost(req, res);

    expect(Post.create).toHaveBeenCalled();
    expect(Post.create.mock.calls[0][0]).toMatchObject({
      ...req.body,
      author: req.user.id,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedPost);
  });

  it('should return all posts', async () => {
    const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
    Post.find.mockReturnValueOnce({
      skip: () => ({
        limit: () => Promise.resolve(mockPosts),
      }),
    });

    await getPosts(req, res);

    expect(Post.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPosts);
  });

  it('should update a post when found and authorized', async () => {
    const foundPost = {
      _id: 'post123',
      author: {
        toString: () => 'user123',
      },
    };
    const updatedPost = { title: 'Updated Title' };

    Post.findById.mockResolvedValue(foundPost);
    Post.findByIdAndUpdate.mockResolvedValue(updatedPost);

    await updatePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('post123');
    expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
      'post123',
      req.body,
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedPost);
  });

  it('should delete a post by ID', async () => {
    const foundPost = {
      _id: 'post123',
      author: {
        toString: () => 'user123',
      },
    };

    Post.findById.mockResolvedValue(foundPost);
    Post.findByIdAndDelete.mockResolvedValue();

    await deletePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('post123');
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith('post123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
  });
});
