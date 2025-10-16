```markdown
Backend notes

Image uploads:
- The backend supports receiving multipart/form-data for creating/updating products. Include a file field named `image`.
- If `CLOUDINARY_URL` is set in the environment (for example: `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`), uploaded files will be forwarded to Cloudinary and the returned secure URL will be stored in the product `image` field.
- If `CLOUDINARY_URL` is not set, the server will accept an `imageUrl` form field or JSON `image` URL and store it directly.

To install new backend dependencies run in `backend/`:

npm install

Environment:
- Add CLOUDINARY_URL to your `.env` if you want automatic uploads to Cloudinary.

Security:
- These endpoints are intended for admin-only use; ensure your auth middleware restricts access in production.
```
