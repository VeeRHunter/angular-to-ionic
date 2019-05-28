import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { AppHttpClient } from '../http-client';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

const httpOptions = {
	// tslint:disable-next-line:indent
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class UserProfileService extends AppHttpClient {

	private userlistsUrl = environment.serverUrl + '/dashboard';
	public images: any = [];
	public playVideoFlag = false;
	public showImageFlag = false;
	public selectedVideo: any = '';
	public iframeSrcUrl: SafeUrl;
	public imageSrcUrl: string;

	public getUserProfile(slug: string, type: number): Observable<any> {
		const url = this.userlistsUrl + '/getUserProfile';
		return this.post(url, {
			slug,
			type
		});
	}

	public getUserMedia(slug: string, type: number): Observable<any> {
		const url = this.userlistsUrl + '/getUserMedia';
		return this.post(url, {
			slug,
			type
		});
	}

	public requestPlayer(selectedIds: string[]): Observable<any> {
		const userId = 10;
		const url = environment.serverUrl + '/request-player';
		return this.post(url, {
			selectedIds,
			userId
		});
	}
}
