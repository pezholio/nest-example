import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';
import { ValidationFailedError } from '../helpers/validator';

describe('BlogPostsController', () => {
  let controller: BlogPostsController;
  let service: BlogPostsService;

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
    service = module.get<BlogPostsService>(BlogPostsService);
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
      const res = createMock<Response>();

      await controller.create(newBlogPostDto, res);

      expect(res.redirect).toHaveBeenCalledWith(301, '/blog-posts');
    });

    it('should render errors when the post is invalid', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: '',
        body: '',
      };
      const res = createMock<Response>();
      const errors = [];

      service.create = jest.fn().mockImplementation(() => {
        throw new ValidationFailedError(errors);
      });

      await controller.create(newBlogPostDto, res);

      expect(res.render).toHaveBeenCalledWith('blog-posts/new', {
        blogPost: newBlogPostDto,
        errors: {},
      });
    });
  });

  describe('update', () => {
    it('should update a new blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: 'Blog Post 1',
        body: 'Some text',
      };
      const res = createMock<Response>();

      await controller.update('some-uuid', newBlogPostDto, res);

      expect(res.redirect).toHaveBeenCalledWith(301, '/blog-posts');
    });

    it('should render errors when the post is invalid', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: '',
        body: 'Some text',
      };
      const res = createMock<Response>();
      const errors = [];

      service.update = jest.fn().mockImplementation(() => {
        throw new ValidationFailedError(errors);
      });

      await controller.update('some-uuid', newBlogPostDto, res);

      expect(res.render).toHaveBeenCalledWith('blog-posts/edit', {
        blogPost: newBlogPostDto,
        errors: {},
      });
    });
  });
});
