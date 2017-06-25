import LocalizedStrings from 'react-native-localization';

const dictionary = new LocalizedStrings({
    en: {
        // upgrade notes
        newFeature: 'New Feature: ',
        newFeatureDescription: '- A progress bar indicating upload progress.',

        // Scene: Home
        uploadFromCamera: 'Take photo & upload',
        uploadFromNativeSelector: 'Upload from native selector',
        uploadFromGallery: 'Select recent images & upload',
        showHistory: 'Show upload history',

        // Scene: CameraRollGallery
        uploadSelectedImages: 'Upload selected images',
        selectAtLeastOneImageToUpload: 'Select at least one image to upload.',

        // Scene: Uploading
        uploadingMultipleImages: 'Uploading multiple images...',
        uploadedImages: 'Uploaded images',
        failedToUploadSelectedImage: 'Failed to upload a image,\ntrying to finish rest upload operations.',
        failedToReadSelectedImage: 'Failed to read selected image file.',
        allUploadActionsAreFailed: 'Failed to upload selected image.',
        numUploadActionsAreFailed: 'image(s) failed to upload.',

        // Scene: Histroy (Results)
        copySelectedURLs: 'Copy selected URLs to clipboard',
        deleteRemoteImage: 'Delete remote image on Imgur',
        deleteRemoteImageDescription: 'Are you sure to delete this image: ',
        deletingRemoteImage: 'Deleting: ',
        cancel: 'Cancel',
        ok: 'OK',

        // copyResultsToClipboard()
        copiedSelectedURLsToClipboard: 'Copied selected URL(s) to the clipboard.',

        // Scene: Settings
        options: 'Options',
        automaticallyCopyResultURLs: 'Automatically copy the result URLs',
        useMIMETypeSelector: 'Use MIME type native selector instead',
        displayLanguage: 'Display Language',
        systemLocale: 'System default',
        operations: 'Operations',
        clearLocalUploadHistory: 'Clear local upload history',
        clearLocalUploadHistoryPrompt: 'Clear local upload history',
        clearLocalUploadHistoryDescription: 'Are you sure to clear local upload history? All Imgur link records including delete hashes will lost!',
        clearedLocalHistory: 'Cleared local upload history.',
        about: 'About',
        githubRepository: 'Github repository',
    },
    zh: {
        // upgrade notes
        newFeature: '新功能: ',
        newFeatureDescription: '- 上傳時顯示準確的進度條',

        // Scene: Home
        uploadFromCamera: '拍照並上傳',
        uploadFromNativeSelector: '從原生圖片庫選擇檔案上傳',
        uploadFromGallery: '從最近使用的圖片中多選上傳',
        showHistory: '檢視上傳記錄',

        // Scene: CameraRollGallery
        uploadSelectedImages: '上傳所有已選取的圖片',
        selectAtLeastOneImageToUpload: '請至少選擇一張圖片以上傳',

        // Scene: Uploading
        uploadingMultipleImages: '正在上傳圖片...',
        uploadedImages: '已上傳的圖片數',
        failedToUploadSelectedImage: '選擇的圖片中有一項上傳失敗，\n正在嘗試完成剩餘的上傳操作。',
        failedToReadSelectedImage: '無法讀取所選擇的圖片檔',
        allUploadActionsAreFailed: '所選擇的圖片上傳失敗',
        numUploadActionsAreFailed: '張圖片上傳失敗',

        // Scene: Histroy (Results)
        copySelectedURLs: '將已勾選的連結複製到剪貼簿',
        deleteRemoteImage: '刪除在 Imgur 上的圖片',
        deleteRemoteImageDescription: '確定要刪除這個圖片嗎: ',
        deletingRemoteImage: '正在刪除圖片: ',
        cancel: '取消',
        ok: '確認',

        // copyResultsToClipboard()
        copiedSelectedURLsToClipboard: '已將勾選的連結複製到剪貼簿',

        // Scene: Settings
        options: '選項',
        automaticallyCopyResultURLs: '自動將上傳結果的連結複製到剪貼簿',
        useMIMETypeSelector: '圖片庫改使用 MIME 類型原生選擇器',
        displayLanguage: '顯示語言',
        systemLocale: '系統預設',
        operations: '操作',
        clearLocalUploadHistory: '清除本地端上傳記錄',
        clearLocalUploadHistoryPrompt: '清除本地端上傳記錄',
        clearLocalUploadHistoryDescription: '確定要刪除本地端上傳記路？您將會遺失包含刪除連結在內的所有 Imgur 連結記錄。',
        clearedLocalHistory: '已清除本地端上傳記錄',
        about: '關於',
        githubRepository: 'Github 源碼庫',
    },
});

export default dictionary;
