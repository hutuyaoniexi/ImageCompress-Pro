// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const previewSection = document.getElementById('previewSection');
const imageList = document.getElementById('imageList');
const imageListContainer = document.getElementById('imageListContainer');
const downloadCurrentBtn = document.getElementById('downloadCurrentBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');

// 当前处理的图片数据
let images = new Map();
let activeImageId = null;
const MAX_IMAGES = 10;

// 事件监听器
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#D2D2D7';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#D2D2D7';
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
        handleImageUploads(files);
    }
});

imageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
        handleImageUploads(files);
    }
});

qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    const quality = e.target.value / 100;
    if (activeImageId && images.has(activeImageId)) {
        const image = images.get(activeImageId);
        compressImage(image, quality);
    }
});

downloadCurrentBtn.addEventListener('click', () => {
    if (activeImageId && images.has(activeImageId)) {
        const image = images.get(activeImageId);
        if (image.compressedDataUrl) {
            downloadImage(image.compressedDataUrl, `compressed_${image.name}`);
        }
    }
});

downloadAllBtn.addEventListener('click', () => {
    images.forEach((image, id) => {
        if (image.compressedDataUrl) {
            downloadImage(image.compressedDataUrl, `compressed_${image.name}`);
        }
    });
});

/**
 * 处理图片下载
 * @param {string} dataUrl - 图片的 Data URL
 * @param {string} fileName - 下载时的文件名
 */
function downloadImage(dataUrl, fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 处理多个图片上传
 * @param {File[]} files - 上传的图片文件数组
 */
function handleImageUploads(files) {
    // 检查是否超过最大数量限制
    if (images.size + files.length > MAX_IMAGES) {
        alert(`最多只能上传${MAX_IMAGES}张图片`);
        return;
    }

    // 处理每个文件
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const id = Date.now() + Math.random().toString(36).substr(2, 9);
            const image = {
                id,
                file,
                name: file.name,
                originalDataUrl: e.target.result,
                originalSize: file.size
            };

            // 添加到图片集合
            images.set(id, image);

            // 如果是第一张图片，显示预览区域并设置为活动图片
            if (images.size === 1) {
                previewSection.classList.remove('hidden');
                setActiveImage(id);
            }

            // 创建列表项
            createImageListItem(image);

            // 更新图片列表显示状态
            updateImageListVisibility();

            // 压缩图片
            compressImage(image, qualitySlider.value / 100);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * 更新图片列表显示状态
 */
function updateImageListVisibility() {
    if (images.size > 1) {
        imageList.classList.remove('hidden');
    } else {
        imageList.classList.add('hidden');
    }
}

/**
 * 创建图片列表项
 * @param {Object} image - 图片对象
 */
function createImageListItem(image) {
    const listItem = document.createElement('div');
    listItem.className = 'image-list-item';
    listItem.setAttribute('data-image-id', image.id);
    listItem.innerHTML = `
        <img src="${image.originalDataUrl}" alt="${image.name}">
        <div class="image-info">
            <span>原始大小：${formatFileSize(image.originalSize)}</span>
            <span class="compressed-size">压缩后：处理中...</span>
        </div>
    `;
    
    listItem.addEventListener('click', () => {
        setActiveImage(image.id);
    });
    
    imageListContainer.appendChild(listItem);
}

/**
 * 设置当前活动图片
 * @param {string} imageId - 图片ID
 */
function setActiveImage(imageId) {
    if (!images.has(imageId)) return;

    // 更新活动状态
    if (activeImageId) {
        const prevItem = document.querySelector(`.image-list-item[data-image-id="${activeImageId}"]`);
        if (prevItem) {
            prevItem.classList.remove('active');
        }
    }
    
    activeImageId = imageId;
    const currentItem = document.querySelector(`.image-list-item[data-image-id="${imageId}"]`);
    if (currentItem) {
        currentItem.classList.add('active');
    }

    // 更新预览图片
    const image = images.get(imageId);
    updatePreviewImages(image);
}

/**
 * 更新预览图片
 * @param {Object} image - 图片对象
 */
function updatePreviewImages(image) {
    // 更新原始图片
    originalImage.src = image.originalDataUrl;
    originalSize.textContent = formatFileSize(image.originalSize);

    // 更新压缩后的图片
    if (image.compressedDataUrl) {
        compressedImage.src = image.compressedDataUrl;
        compressedSize.textContent = formatFileSize(image.compressedSize);
    } else {
        compressedImage.src = '';
        compressedSize.textContent = '处理中...';
    }

    // 更新下载按钮状态
    updateDownloadButtons();
}

/**
 * 更新下载按钮状态
 */
function updateDownloadButtons() {
    const hasCompressedImages = Array.from(images.values()).some(image => image.compressedDataUrl);
    downloadCurrentBtn.disabled = !activeImageId || !images.get(activeImageId)?.compressedDataUrl;
    downloadAllBtn.disabled = !hasCompressedImages;
}

/**
 * 压缩图片
 * @param {Object} image - 图片对象
 * @param {number} quality - 压缩质量（0-1）
 */
function compressImage(image, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 保持原始尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx.drawImage(img, 0, 0);

        // 压缩
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 计算压缩后的大小
        const base64Str = compressedDataUrl.split(',')[1];
        const compressedSize = Math.ceil((base64Str.length * 3) / 4);

        // 更新图片数据
        image.compressedDataUrl = compressedDataUrl;
        image.compressedSize = compressedSize;

        // 更新列表项
        const listItem = document.querySelector(`.image-list-item[data-image-id="${image.id}"]`);
        if (listItem) {
            const compressedSizeElement = listItem.querySelector('.compressed-size');
            compressedSizeElement.textContent = `压缩后：${formatFileSize(compressedSize)}`;
        }

        // 如果是当前活动图片，更新预览
        if (image.id === activeImageId) {
            updatePreviewImages(image);
        }
    };
    img.src = image.originalDataUrl;
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 