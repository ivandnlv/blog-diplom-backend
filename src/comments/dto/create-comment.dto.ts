export class CreateCommentDto {
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId?: number | null;
}
