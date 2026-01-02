import os
import base64
from datetime import datetime
from pathlib import Path

# Thư mục lưu ảnh
UPLOAD_FOLDER = Path(__file__).parent.parent.parent / 'uploads' / 'rooms'
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

def save_image_from_base64(base64_string, filename=None):
    """
    Lưu ảnh từ base64 string vào file system
    Returns: URL path của ảnh đã lưu
    """
    try:
        # Parse base64 string (remove data:image/...;base64, prefix if exists)
        if ',' in base64_string:
            header, data = base64_string.split(',', 1)
        else:
            data = base64_string
        
        # Decode base64
        image_data = base64.b64decode(data)
        
        # Generate filename if not provided
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'room_{timestamp}.jpg'
        
        # Ensure filename has extension
        if '.' not in filename:
            filename = f'{filename}.jpg'
        
        # Save file
        file_path = UPLOAD_FOLDER / filename
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        # Return relative URL path
        return f'/uploads/rooms/{filename}'
    except Exception as e:
        raise ValueError(f"Error saving image: {str(e)}")

def delete_image(image_url):
    """
    Xóa ảnh từ file system
    """
    try:
        if image_url and image_url.startswith('/uploads/'):
            file_path = Path(__file__).parent.parent.parent / image_url.lstrip('/')
            if file_path.exists():
                file_path.unlink()
                return True
        return False
    except Exception as e:
        print(f"Error deleting image: {str(e)}")
        return False

