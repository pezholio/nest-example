import { Test, TestingModule } from '@nestjs/testing';

import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';

describe('BlogPostsController', () => {
  let controller: BlogPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [
        {
          provide: BlogPostsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { title: 'Blog Post 1', body: 'Some text' },
              { title: 'Blog Post 2', body: 'Some text' },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                title: 'Blog Post 1',
                body: 'Some text',
                id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((blogPost: CreateBlogPostDto) =>
                Promise.resolve({ id: 'a uuid', ...blogPost }),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (postID: string, blogPost: CreateBlogPostDto) =>
                  Promise.resolve({ id: postID, ...blogPost }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should fetch all blog posts', async () => {
      expect(await controller.findAll()).toEqual({
        blogPosts: [
          { title: 'Blog Post 1', body: 'Some text' },
          { title: 'Blog Post 2', body: 'Some text' },
        ],
      });
    });
  });

  describe('show', () => {
    it('should fetch a single blog post', async () => {
      expect(await controller.show('some-id')).toEqual({
        blogPost: {
          title: 'Blog Post 1',
          body: 'Some text',
          id: 'some-id',
        },
      });
    });
  });

  describe('edit', () => {
    it('should fetch a single blog post', async () => {
      expect(await controller.show('some-id')).toEqual({
        blogPost: {
          title: 'Blog Post 1',
          body: 'Some text',
          id: 'some-id',
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: 'Blog Post 1',
        body: 'Some text',
      };
      await expect(controller.create(newBlogPostDto)).resolves.toEqual({
        id: 'a uuid',
        ...newBlogPostDto,
      });
    });
  });

  describe('update', () => {
    it('should update a new blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: 'Blog Post 1',
        body: 'Some text',
      };
      await expect(
        controller.update('some-uuid', newBlogPostDto),
      ).resolves.toEqual({
        id: 'some-uuid',
        ...newBlogPostDto,
      });
    });
  });
});
