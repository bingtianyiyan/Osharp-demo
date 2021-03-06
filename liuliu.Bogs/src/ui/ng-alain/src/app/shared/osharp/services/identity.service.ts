import { Injectable, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DA_SERVICE_TOKEN, ITokenService, JWTTokenModel } from "@delon/auth";
import { SettingsService, _HttpClient, MenuService } from "@delon/theme";
import { ACLService } from "@delon/acl";
import { Observable, zip } from "rxjs";
import { ReuseTabService } from "@delon/abc";
import { CacheService } from "@delon/cache";
import {
	LoginDto,
	AjaxResult,
	AjaxResultType,
	RegisterDto,
	ConfirmEmailDto,
	User,
	SendMailDto,
	AdResult,
	ResetPasswordDto,
	UserLoginInfoEx,
	ChangePasswordDto,
	ProfileEditDto,
	TokenDto,
	JsonWebToken,
	LocalTokenModel
} from "@shared/osharp/osharp.model";
import { OsharpService } from "@shared/osharp/services/osharp.service";
import { catchError } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class IdentityService {
	constructor(
		public http: _HttpClient,
		private osharp: OsharpService,
		@Inject(DA_SERVICE_TOKEN) private tokenSrv: ITokenService,
		private cache: CacheService,
		private settingSrv: SettingsService,
		private aclSrv: ACLService,
		private reuseTabSrv: ReuseTabService,
		private menuSrv: MenuService
	) {}

	get user() {
		return this.settingSrv.user;
	}

	get router(): Router {
		return this.osharp.router;
	}

	token(dto: TokenDto): Promise<AjaxResult> {
		const url = "api/identity/token";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((result) => {
				if (result.Type === AjaxResultType.Success) {
					this.loginEnd(result.Data as JsonWebToken).subscribe();
				}
				return result;
			})
			.toPromise();
	}

	login(dto: LoginDto): Promise<AjaxResult> {
		const url = "api/identity/token";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((result) => {
				if (result.Type === AjaxResultType.Success) {
					this.loginEnd(result.Data as JsonWebToken).subscribe();
				}
				return result;
			})
			.toPromise();
	}

	logout() {
		const url = "api/identity/logout";
		return this.http
			.post<AjaxResult>(url, {})
			.map((res) => {
				if (res.Type === AjaxResultType.Success) {
					this.loginEnd(null).subscribe();
				}
				return res;
			})
			.toPromise();
	}

	register(dto: RegisterDto): Promise<AdResult> {
		const url = "api/identity/register";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((res) => {
				const result = new AdResult();
				if (res.Type === AjaxResultType.Success) {
					const data: any = res.Data;
					result.type = "success";
					result.title = "?????????????????????";
					result.description = `???????????????${data.UserName}[${data.NickName}] ???????????????????????????????????? ${data.Email} ???????????????????????????`;
					return result;
				}
				result.type = "error";
				result.title = "??????????????????";
				result.description = res.Content;
				return result;
			})
			.toPromise();
	}

	loginBind(info: UserLoginInfoEx) {
		const url = "api/identity/LoginBind";
		return this.http
			.post<AjaxResult>(url, info)
			.map((result) => {
				if (result.Type === AjaxResultType.Success) {
					this.loginEnd(result.Data as JsonWebToken).subscribe();
				}
				return result;
			})
			.toPromise();
	}

	loginOneKey(info: UserLoginInfoEx) {
		const url = "api/identity/LoginOneKey";
		return this.http
			.post<AjaxResult>(url, info)
			.map((result) => {
				if (result.Type === AjaxResultType.Success) {
					this.loginEnd(result.Data as JsonWebToken).subscribe();
				}
				return result;
			})
			.toPromise();
	}

	loginEnd(token: JsonWebToken) {
		// ????????????????????????
		this.reuseTabSrv.clear();
		// ??????Token
		this.setToken(token);
		// ??????????????????
		return this.refreshUser();
	}

	setToken(token: JsonWebToken) {
		if (token) {
			this.tokenSrv.set({ token: token.AccessToken });
			let seconds = new Date().getTime();
			seconds = Math.round((token.RefreshUctExpires - seconds) / 1000);
			if (seconds > 0) {
				this.cache.set("refresh_token", token.RefreshToken, { expire: seconds });
			}
		} else {
			this.tokenSrv.clear();
			this.cache.remove("refresh_token");
			this.settingSrv.setUser({});
		}
	}

	getAccessToken(): JWTTokenModel {
		const accessToken = this.tokenSrv.get<JWTTokenModel>(JWTTokenModel);
		return accessToken;
	}

	getRefreshToken(): string {
		const refreshToken = this.cache.getNone<string>("refresh_token");
		return refreshToken;
	}

	/**
   * ????????????AccessToken???RefreshToken??????5?????????AccessToken??????????????????????????????RefreshToken?????????
   */
	tryRefreshToken() {
		const accessToken = this.getAccessToken();
		if (accessToken && accessToken.token && accessToken.token.includes(".")) {
			const diff = Math.round(accessToken.payload.exp - new Date().getTime() / 1000);
			if (diff > 20) return;
		}
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			// ??????RefreshToken???????????????????????????
			if (this.router.url === "/exception/403") {
				setTimeout(() => this.router.navigateByUrl("/passport/login"));
			}
			return;
		}
		this.refreshToken(refreshToken).subscribe();
	}

	/**
   * ???????????????RefreshToken????????????AccessToken???RefreshToken
   * @param refreshToken ?????????RefreshToken
   */
	refreshToken(refreshToken: string) {
		// ??????RefreshToken??????AccessToken
		const dto: TokenDto = { RefreshToken: refreshToken, GrantType: "refresh_token" };
		return this.http.post<AjaxResult>("api/identity/token", dto).map((result) => {
			if (result.Type === AjaxResultType.Success) {
				this.setToken(result.Data as JsonWebToken);
			} else {
				this.cache.remove("refresh_token");
			}
			return result;
		});
	}

	/**
   * ???????????????????????????????????????
   */
	refreshAuth() {
		zip(this.http.get("api/auth/getauthinfo"), this.http.get("api/identity/profile"), this.http.get("assets/osharp/app-data.json"))
			.pipe(
				catchError(([ authInfo, userInfo, appData ]) => {
					return [ authInfo, userInfo, appData ];
				})
			)
			.subscribe(([ authInfo, userInfo, appData ]) => {
				this.aclSrv.setAbility(authInfo);
				if (userInfo && userInfo.UserName) {
					let user: User = { name: userInfo.UserName, avatar: userInfo.HeadImg, email: userInfo.Email, nickName: userInfo.NickName };
					this.settingSrv.setUser(user);
				}
				this.menuSrv.add(appData.menu);
			});
	}

	removeOAuth2(id: string) {
		const url = "api/identity/RemoveOAuth2";
		return this.http
			.post<AjaxResult>(url, [ id ])
			.map((res) => {
				this.osharp.ajaxResult(res);
				return res;
			})
			.toPromise();
	}

	/** ?????????????????? */
	refreshUser(): Observable<User> {
		const url = "api/identity/profile";
		return this.http.get(url).map((res: any) => {
			if (!res || res === {}) {
				this.settingSrv.setUser({});
				this.aclSrv.setRole([]);
				return {};
			}
			const user: User = {
				id: res.Id,
				name: res.UserName,
				nickName: res.NickName,
				avatar: res.HeadImg,
				email: res.Email,
				roles: res.Roles,
				isAdmin: res.IsAdmin
			};
			this.settingSrv.setUser(user);
			// ????????????
			this.aclSrv.setRole(user.roles);
			return user;
		});
	}

	sendConfirmMail(dto: SendMailDto): Promise<AdResult> {
		const url = "api/identity/SendConfirmMail";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((res) => {
				const result = new AdResult();
				if (res.Type !== AjaxResultType.Success) {
					result.type = "error";
					result.title = "????????????????????????";
					result.description = res.Content;
					return result;
				}
				result.type = "success";
				result.title = "????????????????????????";
				result.description = `?????????????????????????????????????????????????????????${dto.Email}?????????????????????????????????`;
				return result;
			})
			.toPromise();
	}

	confirmEmail(dto: ConfirmEmailDto): Promise<AdResult> {
		const url = "api/identity/ConfirmEmail";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((res) => {
				const result = new AdResult();
				if (res.Type !== AjaxResultType.Success) {
					result.type = "error";
					result.title = "????????????????????????";
					if (res.Type === AjaxResultType.Info) {
						result.type = "minus-circle-o";
					}
					result.title = "????????????????????????";
					result.description = res.Content;
					return result;
				}
				result.type = "success";
				result.title = "????????????????????????";
				result.description = res.Content;
				return result;
			})
			.toPromise();
	}

	sendResetPasswordMail(dto: SendMailDto): Promise<AdResult> {
		const url = "api/identity/SendResetPasswordMail";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((res) => {
				const result = new AdResult();
				if (res.Type !== AjaxResultType.Success) {
					result.type = "error";
					result.title = "??????????????????????????????";
					result.description = res.Content;
					return result;
				}
				result.type = "success";
				result.title = "??????????????????????????????";
				result.description = `???????????????????????????????????????????????????${dto.Email}?????????????????????????????????`;
				return result;
			})
			.toPromise();
	}

	resetPassword(dto: ResetPasswordDto): Promise<AdResult> {
		const url = "api/identity/ResetPassword";
		return this.http
			.post<AjaxResult>(url, dto)
			.map((res) => {
				const result = new AdResult();
				if (res.Type !== AjaxResultType.Success) {
					result.type = "error";
					result.title = "????????????????????????";
					result.description = res.Content;
					return result;
				}
				result.type = "success";
				result.title = "????????????????????????";
				result.description = "????????????????????????????????????????????????????????????";
				return result;
			})
			.toPromise();
	}

	profileEdit(dto: ProfileEditDto) {
		const url = "api/identity/ProfileEdit";
		return this.http.post<AjaxResult>(url, dto).subscribe((res) => {
			this.osharp.ajaxResult(res);
			this.refreshUser().subscribe();
		});
	}

	changePassword(dto: ChangePasswordDto) {
		const url = "api/identity/ChangePassword";
		return this.http.post<AjaxResult>(url, dto).subscribe((res) => {
			this.osharp.ajaxResult(res);
		});
	}
}
