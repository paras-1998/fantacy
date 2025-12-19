import { fetchUtils, DataProvider } from 'react-admin';
import { stringify } from 'query-string';

// const apiUrl = 'http://localhost:3005/api/admin';
const apiUrl = '/api/admin';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {

  const customHeaders = (options.headers ||
    new Headers({
        Accept: 'application/json',
    })) as Headers;
      // add your own headers here
      const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') as string) : null;
      if (token) {
        customHeaders.set('Authorization', `Bearer ${token}`);
      }

      options.headers = customHeaders;
      return fetchUtils.fetchJson(url, options);


    
};


export const dataProvider: DataProvider = {
  getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
            sort: JSON.stringify([field, order]),
            page : page,
            perPage : perPage,
            filter: JSON.stringify(params.filter),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => ({
          data: json.data,
          total: json.count,
      }));
  },

  getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
          data: json.data,
      })),

  getMany: (resource, params) => {
      const query = {
          filter: JSON.stringify({ id: params.ids }),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      return httpClient(url).then(({ json }) => ({ data: json.data }));
  },

  getManyReference: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
          sort: JSON.stringify([field, order]),
          range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
          filter: JSON.stringify({
              ...params.filter,
              [params.target]: params.id,
          }),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => ({
          data: json.data,
          total: parseInt((headers.get('content-range') || "0").split('/').pop() || '0', 10),
      }));
  },

  update: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json.data })),

  updateMany: (resource, params) => {
      const query = {
          filter: JSON.stringify({ id: params.ids}),
      };
      return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
          method: 'POST',
          body: JSON.stringify(params.data),
      }).then(({ json }) => ({
          data: { ...params.data, id: json.data.id } as any,
      })),

  delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
          method: 'DELETE',
      }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
      const query = {
          filter: JSON.stringify({ id: params.ids}),
      };
      return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
          method: 'DELETE',
      }).then(({ json }) => ({ data: json.data }));
  }
};