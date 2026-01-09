# File Upload & Cloud Storage Skill

## Description
Expert in implementing file upload functionality, cloud storage integration (AWS S3, Cloudinary), and file management for web applications.

## Capabilities

### File Upload
- **Multipart Upload**: Large file uploads
- **Direct Upload**: Client-to-cloud uploads
- **Chunked Upload**: Resume-able uploads
- **Drag & Drop**: User-friendly upload interface
- **File Validation**: Type, size, and content validation
- **Progress Tracking**: Upload progress indicators
- **Multiple Files**: Batch file uploads

### Cloud Storage
- **AWS S3**: Object storage service
- **Cloudinary**: Image and video management
- **Google Cloud Storage**: GCS integration
- **Azure Blob Storage**: Microsoft cloud storage
- **Presigned URLs**: Secure temporary access
- **CDN Integration**: Fast content delivery

### File Processing
- **Image Optimization**: Compression and resizing
- **Thumbnail Generation**: Preview images
- **Format Conversion**: Image format transformation
- **Video Processing**: Transcoding and thumbnails
- **PDF Generation**: Document creation
- **File Compression**: ZIP archives

### Security
- **File Type Validation**: MIME type checking
- **Virus Scanning**: Malware detection
- **Access Control**: Signed URLs and permissions
- **Encryption**: At-rest and in-transit encryption
- **Rate Limiting**: Upload throttling
- **Size Limits**: Maximum file size enforcement

## Usage Examples

### FastAPI File Upload

```python
# app/routers/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
import os
import uuid
from pathlib import Path
import magic
from PIL import Image
from app.config import settings
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Allowed file types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file_type(file: UploadFile, allowed_types: set) -> bool:
    """Validate file MIME type"""
    # Read first 2048 bytes to detect MIME type
    file_content = file.file.read(2048)
    file.file.seek(0)  # Reset file pointer

    mime = magic.from_buffer(file_content, mime=True)
    return mime in allowed_types

def validate_file_size(file: UploadFile, max_size: int) -> bool:
    """Validate file size"""
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    return file_size <= max_size

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload image file"""

    # Validate file type
    if not validate_file_type(file, ALLOWED_IMAGE_TYPES):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
        )

    # Validate file size
    if not validate_file_size(file, MAX_FILE_SIZE):
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / 1024 / 1024}MB."
        )

    try:
        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"

        # Create upload directory
        upload_dir = Path(settings.UPLOAD_DIR) / "images"
        upload_dir.mkdir(parents=True, exist_ok=True)

        # Save file
        file_path = upload_dir / unique_filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Generate thumbnail
        thumbnail_path = upload_dir / f"thumb_{unique_filename}"
        with Image.open(file_path) as img:
            img.thumbnail((200, 200))
            img.save(thumbnail_path)

        # Save to database
        from app.models.file import FileUpload
        from app.database import get_db

        db = next(get_db())
        file_record = FileUpload(
            filename=file.filename,
            stored_filename=unique_filename,
            file_path=str(file_path),
            thumbnail_path=str(thumbnail_path),
            file_size=os.path.getsize(file_path),
            mime_type=file.content_type,
            user_id=current_user.id
        )
        db.add(file_record)
        db.commit()
        db.refresh(file_record)

        return {
            "id": file_record.id,
            "filename": file.filename,
            "url": f"/uploads/images/{unique_filename}",
            "thumbnail_url": f"/uploads/images/thumb_{unique_filename}",
            "size": file_record.file_size
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user)
):
    """Upload multiple files"""

    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 files allowed per upload"
        )

    uploaded_files = []

    for file in files:
        try:
            # Validate and upload each file
            result = await upload_image(file, current_user)
            uploaded_files.append(result)
        except Exception as e:
            # Continue with other files even if one fails
            uploaded_files.append({
                "filename": file.filename,
                "error": str(e)
            })

    return {
        "uploaded": len([f for f in uploaded_files if "error" not in f]),
        "failed": len([f for f in uploaded_files if "error" in f]),
        "files": uploaded_files
    }

@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user = Depends(get_current_user)
):
    """Delete uploaded file"""
    from app.models.file import FileUpload
    from app.database import get_db

    db = next(get_db())

    file_record = db.query(FileUpload).filter(
        FileUpload.id == file_id,
        FileUpload.user_id == current_user.id
    ).first()

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    # Delete physical files
    try:
        if os.path.exists(file_record.file_path):
            os.remove(file_record.file_path)
        if file_record.thumbnail_path and os.path.exists(file_record.thumbnail_path):
            os.remove(file_record.thumbnail_path)
    except Exception as e:
        logger.error(f"Error deleting files: {e}")

    # Delete database record
    db.delete(file_record)
    db.commit()

    return {"message": "File deleted successfully"}
```

### AWS S3 Integration

```python
# app/storage/s3.py
import boto3
from botocore.exceptions import ClientError
from typing import Optional, BinaryIO
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class S3Storage:
    """AWS S3 storage handler"""

    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET

    def upload_file(
        self,
        file_obj: BinaryIO,
        object_name: str,
        content_type: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> bool:
        """Upload file to S3"""
        try:
            extra_args = {}

            if content_type:
                extra_args['ContentType'] = content_type

            if metadata:
                extra_args['Metadata'] = metadata

            # Make file public-read (optional)
            extra_args['ACL'] = 'public-read'

            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                object_name,
                ExtraArgs=extra_args
            )

            logger.info(f"File uploaded to S3: {object_name}")
            return True

        except ClientError as e:
            logger.error(f"S3 upload error: {e}")
            return False

    def download_file(self, object_name: str, file_path: str) -> bool:
        """Download file from S3"""
        try:
            self.s3_client.download_file(
                self.bucket_name,
                object_name,
                file_path
            )
            return True
        except ClientError as e:
            logger.error(f"S3 download error: {e}")
            return False

    def delete_file(self, object_name: str) -> bool:
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=object_name
            )
            logger.info(f"File deleted from S3: {object_name}")
            return True
        except ClientError as e:
            logger.error(f"S3 delete error: {e}")
            return False

    def generate_presigned_url(
        self,
        object_name: str,
        expiration: int = 3600
    ) -> Optional[str]:
        """Generate presigned URL for temporary access"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_name
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            return None

    def generate_presigned_post(
        self,
        object_name: str,
        fields: Optional[dict] = None,
        conditions: Optional[list] = None,
        expiration: int = 3600
    ) -> Optional[dict]:
        """Generate presigned POST for direct browser upload"""
        try:
            response = self.s3_client.generate_presigned_post(
                self.bucket_name,
                object_name,
                Fields=fields,
                Conditions=conditions,
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Error generating presigned POST: {e}")
            return None

    def list_files(self, prefix: str = "") -> list:
        """List files in bucket"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )

            if 'Contents' not in response:
                return []

            return [
                {
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat()
                }
                for obj in response['Contents']
            ]
        except ClientError as e:
            logger.error(f"Error listing files: {e}")
            return []

    def get_file_url(self, object_name: str) -> str:
        """Get public URL for file"""
        return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{object_name}"

# Create global S3 storage instance
s3_storage = S3Storage()

# Usage in routes
@router.post("/upload-to-s3")
async def upload_to_s3(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload file directly to S3"""

    # Generate unique object name
    object_name = f"uploads/{current_user.id}/{uuid.uuid4()}{Path(file.filename).suffix}"

    # Upload to S3
    success = s3_storage.upload_file(
        file.file,
        object_name,
        content_type=file.content_type,
        metadata={
            'user_id': str(current_user.id),
            'original_filename': file.filename
        }
    )

    if not success:
        raise HTTPException(status_code=500, detail="Upload to S3 failed")

    # Get file URL
    file_url = s3_storage.get_file_url(object_name)

    return {
        "url": file_url,
        "object_name": object_name,
        "filename": file.filename
    }

@router.get("/presigned-url/{object_name:path}")
async def get_presigned_url(
    object_name: str,
    current_user = Depends(get_current_user)
):
    """Get presigned URL for file access"""

    url = s3_storage.generate_presigned_url(object_name, expiration=3600)

    if not url:
        raise HTTPException(status_code=500, detail="Failed to generate URL")

    return {"url": url, "expires_in": 3600}

@router.post("/presigned-post")
async def get_presigned_post(
    filename: str,
    content_type: str,
    current_user = Depends(get_current_user)
):
    """Get presigned POST for direct browser upload"""

    object_name = f"uploads/{current_user.id}/{uuid.uuid4()}{Path(filename).suffix}"

    # Set conditions
    conditions = [
        {"bucket": settings.S3_BUCKET},
        ["starts-with", "$key", f"uploads/{current_user.id}/"],
        {"acl": "public-read"},
        ["content-length-range", 0, MAX_FILE_SIZE]
    ]

    presigned_post = s3_storage.generate_presigned_post(
        object_name,
        fields={"acl": "public-read"},
        conditions=conditions,
        expiration=3600
    )

    if not presigned_post:
        raise HTTPException(status_code=500, detail="Failed to generate presigned POST")

    return presigned_post
```

### React File Upload Component

```typescript
// components/FileUpload.tsx
import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
}

export function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  multiple = true,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => f.errors[0].message).join(', ')
      setError(errors)
      return
    }

    if (acceptedFiles.length === 0) {
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      await onUpload(acceptedFiles)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    maxFiles,
    multiple,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div>
            <p className="text-gray-600 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop files here'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max {maxSize / 1024 / 1024}MB per file
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Usage
function UploadPage() {
  const handleUpload = async (files: File[]) => {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fetch('/api/upload/multiple', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    console.log('Uploaded:', result)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Files</h1>
      <FileUpload onUpload={handleUpload} />
    </div>
  )
}
```

### Direct S3 Upload from Browser

```typescript
// hooks/useS3Upload.ts
import { useState } from 'react'

export function useS3Upload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadToS3 = async (file: File) => {
    setUploading(true)
    setProgress(0)

    try {
      // Get presigned POST data
      const presignedResponse = await fetch('/api/upload/presigned-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
        }),
      })

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned POST')
      }

      const { url, fields } = await presignedResponse.json()

      // Upload directly to S3
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('file', file)

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('S3 upload failed')
      }

      setProgress(100)

      // Return S3 URL
      const fileUrl = `${url}/${fields.key}`
      return fileUrl

    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  return { uploadToS3, uploading, progress }
}
```

### Cloudinary Integration

```python
# app/storage/cloudinary_storage.py
import cloudinary
import cloudinary.uploader
from app.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class CloudinaryStorage:
    """Cloudinary storage handler"""

    def upload_image(
        self,
        file_path: str,
        folder: str = "uploads",
        transformation: dict = None
    ) -> dict:
        """Upload image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                transformation=transformation,
                resource_type="image"
            )
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "width": result["width"],
                "height": result["height"],
                "format": result["format"]
            }
        except Exception as e:
            logger.error(f"Cloudinary upload error: {e}")
            raise

    def delete_image(self, public_id: str) -> bool:
        """Delete image from Cloudinary"""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            logger.error(f"Cloudinary delete error: {e}")
            return False

    def generate_thumbnail_url(
        self,
        public_id: str,
        width: int = 200,
        height: int = 200
    ) -> str:
        """Generate thumbnail URL with transformation"""
        return cloudinary.CloudinaryImage(public_id).build_url(
            width=width,
            height=height,
            crop="fill",
            quality="auto",
            fetch_format="auto"
        )

cloudinary_storage = CloudinaryStorage()
```

## Best Practices

1. **Validate Files**: Check type, size, and content
2. **Secure Storage**: Use signed URLs and access control
3. **Optimize Images**: Compress and resize before storage
4. **Use CDN**: Serve files through CDN for performance
5. **Virus Scanning**: Scan uploaded files for malware
6. **Rate Limiting**: Prevent abuse with upload limits
7. **Progress Feedback**: Show upload progress to users
8. **Error Handling**: Handle upload failures gracefully
9. **Cleanup**: Delete orphaned files regularly
10. **Backup**: Implement backup strategy for important files

## File Upload Checklist

- [ ] File type validation
- [ ] File size limits
- [ ] Virus scanning (if needed)
- [ ] Storage solution configured (S3/Cloudinary)
- [ ] Upload progress tracking
- [ ] Error handling
- [ ] Access control
- [ ] CDN integration
- [ ] Image optimization
- [ ] Cleanup strategy

## Security Considerations

1. **Validate MIME Types**: Don't trust file extensions
2. **Scan for Malware**: Use antivirus scanning
3. **Limit File Sizes**: Prevent DoS attacks
4. **Use Signed URLs**: Temporary access only
5. **Sanitize Filenames**: Prevent path traversal
6. **Store Outside Web Root**: Prevent direct access
7. **Implement Rate Limiting**: Prevent abuse
8. **Encrypt Sensitive Files**: At-rest encryption
9. **Audit File Access**: Log file operations
10. **Regular Cleanup**: Remove old/unused files

## Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [FastAPI File Uploads](https://fastapi.tiangolo.com/tutorial/request-files/)
- [React Dropzone](https://react-dropzone.js.org/)
- [python-magic](https://github.com/ahupp/python-magic)
