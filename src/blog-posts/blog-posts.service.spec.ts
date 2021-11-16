import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogPostsService } from './blog-posts.service';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto';

const blogPost = new BlogPost('Blog post 1', 'Body');

const blogPostsArray = [blogPost, new BlogPost('Blog post 2', 'Body')];

describe('BlogPostsService', () => {
  let service: BlogPostsService;
  let repo: Repository<BlogPost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostsService,
        {
          provide: getRepositoryToken(BlogPost),
          useValue: {
            find: () => {
              return blogPostsArray;
            },
            findOne: () => {
              return blogPost;
            },
            save: () => {
              return true;
            },
          },
        },
      ],
    }).compile();

    service = module.get<BlogPostsService>(BlogPostsService);
    repo = module.get<Repository<BlogPost>>(getRepositoryToken(BlogPost));
  });

  describe('findAll', () => {
    it('should return all blog posts', async () => {
      const repoSpy = jest.spyOn(repo, 'find');
      const posts = await service.findAll();

      expect(posts).toEqual(blogPostsArray);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a blog post', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      const post = await service.findOne('some-uuid');

      expect(post).toEqual(blogPost);
      expect(repoSpy).toHaveBeenCalledWith('some-uuid');
    });
  });

  describe('create', () => {
    it('should create a blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: 'Blog Post 1',
        body: 'Some text',
      };
      const repoSpy = jest.spyOn(repo, 'save');
      await service.create(newBlogPostDto);

      expect(repoSpy).toHaveBeenCalledWith(newBlogPostDto);
    });
  });

  describe('update', () => {
    it('should update a blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: 'New Title',
        body: 'New text',
      };

      const findOneSpy = jest.spyOn(repo, 'findOne');
      const saveSpy = jest.spyOn(repo, 'save');

      await service.update('some-uuid', newBlogPostDto);

      expect(findOneSpy).toHaveBeenCalledWith('some-uuid');
      expect(saveSpy).toHaveBeenCalledWith(newBlogPostDto);
    });
  });
});
