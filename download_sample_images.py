import urllib.request
import os

def download_image(url, filename):
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

# Create directories if they don't exist
for dir_name in ['reference_photos', 'test_photos']:
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)

# Sample images (using publicly available images)
reference_images = {
    'person1.jpg': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/examples/images/bbt1.jpg',
    'person2.jpg': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/examples/images/bbt2.jpg'
}

test_images = {
    'test1.jpg': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/examples/images/bbt3.jpg',
    'test2.jpg': 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/examples/images/bbt4.jpg'
}

# Download reference images
for filename, url in reference_images.items():
    download_image(url, f'reference_photos/{filename}')

# Download test images
for filename, url in test_images.items():
    download_image(url, f'test_photos/{filename}')
