import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogPostsService } from './blog-posts.service';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto } from './interfaces/create-blog-post.dto'

const blogPost = new BlogPost("Blog post 1", "Body");

const blogPostsArray = [
  blogPost,
  new BlogPost("Blog post 2", "Body"),
]

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
            find: jest.fn().mockResolvedValue(blogPostsArray),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve(blogPost)
            ),
            save: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<BlogPostsService>(BlogPostsService);
    repo = module.get<Repository<BlogPost>>(getRepositoryToken(BlogPost));
  })

  describe('findAll', () => {
    it('should return all blog posts', async () => {
      const repoSpy = jest.spyOn(repo, 'find');
      const posts = await service.findAll();
      expect(posts).toEqual(blogPostsArray);
      expect(repoSpy).toHaveBeenCalled();
    })
  })

  describe('findOne', () => {
    it('should return a blog post', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      const post = await service.findOne("some-uuid");
      expect(post).toEqual(blogPost);
      expect(repoSpy).toHaveBeenCalledWith("some-uuid");
    })
  })

  describe('create', () => {
    it('should create a blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: "Blog Post 1",
        body: "Some text",
      };
      service.create(newBlogPostDto)

      expect(repo.save).toHaveBeenCalledWith(newBlogPostDto)
    })
  })

  describe('update', () => {
    it('should update a blog post', async () => {
      const newBlogPostDto: CreateBlogPostDto = {
        title: "New Title",
        body: "New text",
      };

      service.findOne = jest.fn().mockResolvedValue(blogPost)
      Object.assign = jest.fn(() => newBlogPostDto)

      await service.update("some-uuid", newBlogPostDto)

      expect(service.findOne).toHaveBeenCalledWith("some-uuid")
      expect(Object.assign).toHaveBeenCalledWith(blogPost, newBlogPostDto)
      expect(repo.save).toHaveBeenCalledWith(newBlogPostDto)
    })
  })

})
