/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_CLOUDINARY_PRESET: string;
  readonly VITE_CLOUDINARY_NAME: string;
  readonly VITE_CLOUDINARY_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
