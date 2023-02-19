export * from './BookService';
export * from './ServiceProvider';
export * from './EditServiceProvider';
export * from './HomeServiceProvider';
export * from './AuthServiceProvider';
export * from './NotificationServiceProvider';

type ApiResponse = any;
type InitFormData = any;

export type FormData = ApiResponse | InitFormData;