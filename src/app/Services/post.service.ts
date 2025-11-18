import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostDTO } from '../Models/post.dto';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'posts';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  //TODO 22 
  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post);
  }

  //TODO 23
  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    return this.http.put<PostDTO>(`${this.urlBlogUocApi}/${postId}`, post);
  }

  //TODO 24 
  getPostById(postId: string): Observable<PostDTO> {
    return this.http.get<PostDTO>(`${this.urlBlogUocApi}/${postId}`);
  }

  //TODO 25 
  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(`${this.urlBlogUocApi}?userId=${userId}`);
  }

  //TODO 26 
  deletePost(postId: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBlogUocApi}/${postId}`);
  }

  //TODO 27 
  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi);
  }

  //TODO 28 
  likePost(postId: string): Observable<PostDTO> {
    const id = encodeURIComponent(postId); 
    return this.http.get<PostDTO>(`${this.urlBlogUocApi}/${id}`).pipe(
      switchMap((post) => {
        if (!post) throw new Error('Post no trobat');
        const updatedPost = {
          ...post,
          num_likes: (post.num_likes || 0) + 1,
        };
        return this.http.put<PostDTO>(`${this.urlBlogUocApi}/${id}`, updatedPost);
      })
    );
  }
  //TODO 29 
  dislikePost(postId: string): Observable<PostDTO> {
    const id = encodeURIComponent(postId);
    return this.http.get<PostDTO>(`${this.urlBlogUocApi}/${id}`).pipe(
      switchMap((post) => {
        if (!post) throw new Error('Post no trobat');
        const updatedPost = {
          ...post,
          num_dislikes: (post.num_dislikes || 0) + 1,
        };
        return this.http.put<PostDTO>(`${this.urlBlogUocApi}/${id}`, updatedPost);
      })
    );
  }
}