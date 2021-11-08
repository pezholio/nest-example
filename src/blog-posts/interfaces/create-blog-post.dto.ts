import { IsNotEmpty } from 'class-validator';
export class CreateBlogPostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly body: string;
}
