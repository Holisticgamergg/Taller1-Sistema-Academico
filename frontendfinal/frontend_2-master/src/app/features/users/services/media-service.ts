import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDetails } from '../../../core/services/user-details';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

interface UploadResponse {
    url: string
}

@Injectable({providedIn: 'root'})
export class MediaService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    uploadPhoto(file: File): Observable<UploadResponse> {
        const formData = new FormData()
        formData.append('file', file, file.name)
        return this.http.post<UploadResponse>(`${this.apiUrl}media/upload`, formData)
    }
}