import axios, { AxiosError, AxiosResponse } from "axios";
export * from './url';

const authCreds = {
  withCredentials: true,
}

type QueryData = {
  auth: boolean,
  method: string,
  url: string,
  formData: any,
}

export class QueryHandler {
  auth = false;
  method = 'get';
  url: any = null;
  formData: any = null;

  constructor(props: QueryData | undefined) {
    if (props) {
      const { auth, method, url, formData } = props;
      this.auth = auth;
      this.method = method;
      this.url = url;
      this.formData = formData;
    }
  }

  setAuth(auth: boolean) {
    this.auth = auth;
    return this;
  }

  setMethod(method: string) {
    this.method = method;
    return this;
  }

  setUrl(url: string) {
    this.url = url;
    return this;
  }

  setFormData(formData: any) {
    this.formData = formData;
    return this;
  }

  run(): Promise<any> {
    if (this.method === 'get' && this.auth) {
      return this.getData(authCreds);
    }
    if (this.method === 'get' && !this.auth) {
      return this.getData(undefined);
    }
    if (this.method === 'post' && this.auth) {
      return this.postData(this.formData, authCreds);
    }
    if (this.method === 'post' && !this.auth) {
      return this.postData(this.formData, undefined);
    }
    return Promise.reject(this);
  }

  getData(config: any | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.get(this.url, config)
      .then((res: AxiosResponse<any>) => {
        resolve(res)
      })
      .catch((err: AxiosError<any>) => {
        reject(err)
      })
    })
  }

  postData(formData: any, config: any | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(this.url, formData, config)
      .then((res: AxiosResponse<any>) => {
        resolve(res)
      })
      .catch((err: AxiosError<any>) => {
        reject(err)
      })
    })
  }

  getWithAuthCreds(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.get(url, authCreds)
      .then((res: AxiosResponse<any>) => {
        resolve(res)
      })
      .catch((err: AxiosError<any>) => {
        reject(err)
      })
    })
  }

}