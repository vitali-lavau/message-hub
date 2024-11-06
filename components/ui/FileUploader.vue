<template>
    <div
        class="file-uploader flex items-start"
        @dragover.prevent
        @drop.prevent="handleDrop"
    >
        <input
            ref="fileInput"
            type="file"
            multiple
            class="file-uploader__input"
            @change="handleFileSelect"
            accept=".png, .jpg, .jpeg, .pdf, .pptx, .docx"
        />

        <button
            v-if="props.showButtonAttach"
            @click="triggerFileSelect"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none">
                <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd"
                      d="M0.000175476 3.75005C0.000175476 1.679 2.0149 0 4.5001 0C6.9854 0 9.00004 1.679 9.00004
                      3.75005V15.0001C9.00004 16.3808 7.65689 17.4999 6.00006 17.4999C4.34323 17.4999 3.00008 16.3808
                      3.00008 15.0001V5.00007H4.5001V15.0001C4.5001 15.6904 5.17161 16.2501 6.00006 16.2501C6.82852
                      16.2501 7.5001 15.6904 7.5001 15.0001V3.75005C7.5001 2.36931 6.15695 1.25004 4.5001
                      1.25004C2.84319 1.25004 1.50004 2.36931 1.50004 3.75005V15.0001C1.50004 17.0712 3.51478
                      18.7502 6.00006 18.7502C8.48534 18.7502 10.5001 17.0712 10.5001 15.0001V2.50006H12V15.625C11.6303
                      18.0907 9.0593 20.0001 6.00006 20.0001C2.94099 20.0001 0.369927 18.0907 0 15.625L0.000175476 3.75005Z"
                      fill="#808080"/>
            </svg>
        </button>

        <div
            v-if="files.length"
            class="file-uploader__previews flex flex-wrap"
        >
            <div
                v-for="(file, index) in files"
                :key="index"
                class="file-uploader__preview flex flex-col items-center"
            >
                <img
                    v-if="file.preview"
                    :src="file.preview || undefined"
                    alt="Preview"
                    class="file-img img-responsive"
                />
                <div
                    v-else
                    class="file-icon flex items-center justify-center"
                >
                    {{ fileTypeIcon(file.name) }}
                </div>
                <div class="file-info" :title="file.name">
                    <span>{{ file.name }}</span>
                    {{ formatFileSize(file.size) }}
                </div>
                <button
                    @click="removeFile(index)"
                    class="btn-remove"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M6.66536 3.65951H9.33203C9.33203 3.30588 9.19155 2.96674 8.94151 2.7167C8.69146 2.46665 8.35232 2.32617 7.9987 2.32617C7.64508 2.32617 7.30594 2.46665 7.05589 2.7167C6.80584 2.96674 6.66536 3.30588 6.66536 3.65951ZM5.66536 3.65951C5.66536 3.35309 5.72572 3.04967 5.84298 2.76658C5.96024 2.48348 6.13211 2.22626 6.34878 2.00959C6.56545 1.79292 6.82268 1.62105 7.10577 1.50379C7.38886 1.38653 7.69228 1.32617 7.9987 1.32617C8.30512 1.32617 8.60853 1.38653 8.89163 1.50379C9.17472 1.62105 9.43194 1.79292 9.64861 2.00959C9.86528 2.22626 10.0372 2.48348 10.1544 2.76658C10.2717 3.04967 10.332 3.35309 10.332 3.65951H14.1654C14.298 3.65951 14.4251 3.71218 14.5189 3.80595C14.6127 3.89972 14.6654 4.0269 14.6654 4.15951C14.6654 4.29211 14.6127 4.41929 14.5189 4.51306C14.4251 4.60683 14.298 4.65951 14.1654 4.65951H13.2854L12.5054 12.7335C12.4455 13.3522 12.1574 13.9263 11.6972 14.3441C11.2369 14.7618 10.6376 14.9931 10.016 14.9928H5.98136C5.35994 14.9929 4.76076 14.7615 4.30066 14.3438C3.84056 13.9261 3.55252 13.352 3.4927 12.7335L2.71203 4.65951H1.83203C1.69942 4.65951 1.57225 4.60683 1.47848 4.51306C1.38471 4.41929 1.33203 4.29211 1.33203 4.15951C1.33203 4.0269 1.38471 3.89972 1.47848 3.80595C1.57225 3.71218 1.69942 3.65951 1.83203 3.65951H5.66536ZM6.9987 6.82617C6.9987 6.69356 6.94602 6.56639 6.85225 6.47262C6.75848 6.37885 6.63131 6.32617 6.4987 6.32617C6.36609 6.32617 6.23891 6.37885 6.14514 6.47262C6.05138 6.56639 5.9987 6.69356 5.9987 6.82617V11.8262C5.9987 11.9588 6.05138 12.086 6.14514 12.1797C6.23891 12.2735 6.36609 12.3262 6.4987 12.3262C6.63131 12.3262 6.75848 12.2735 6.85225 12.1797C6.94602 12.086 6.9987 11.9588 6.9987 11.8262V6.82617ZM9.4987 6.32617C9.63131 6.32617 9.75848 6.37885 9.85225 6.47262C9.94602 6.56639 9.9987 6.69356 9.9987 6.82617V11.8262C9.9987 11.9588 9.94602 12.086 9.85225 12.1797C9.75848 12.2735 9.63131 12.3262 9.4987 12.3262C9.36609 12.3262 9.23891 12.2735 9.14514 12.1797C9.05138 12.086 8.9987 11.9588 8.9987 11.8262V6.82617C8.9987 6.69356 9.05138 6.56639 9.14514 6.47262C9.23891 6.37885 9.36609 6.32617 9.4987 6.32617ZM4.48803 12.6375C4.52399 13.0086 4.69686 13.353 4.97294 13.6036C5.24903 13.8541 5.60853 13.9929 5.98136 13.9928H10.016C10.3889 13.9929 10.7484 13.8541 11.0245 13.6036C11.3005 13.353 11.4734 13.0086 11.5094 12.6375L12.2814 4.65951H3.71603L4.48803 12.6375Z"
                            fill="#1E2EB7"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {UploadedFile} from "~/types/UploadedFile";

const props = defineProps<{
    showButtonAttach: boolean;
}>();

// Объявляем событие filesChanged с помощью defineEmits
const emit = defineEmits<{
    (event: 'filesChanged', files: UploadedFile[]): void;
}>();

const files = ref<UploadedFile[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files || []);
    processFiles(selectedFiles);
}

function handleDrop(event: DragEvent) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    processFiles(droppedFiles);
}

function processFiles(selectedFiles: File[]) {
    selectedFiles.forEach((file) => {
        if (file.size <= 10 * 1024 * 1024 && isSupportedFileType(file)) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                files.value.push({
                    name: file.name,
                    size: file.size,
                    preview: e.target?.result as string | null,
                    type: file.type,
                });
                emitFiles();
            };

            if (isImage(file)) {
                reader.readAsDataURL(file);
            } else {
                files.value.push({ name: file.name, size: file.size, preview: null, type: file.type });
                emitFiles();
            }
        } else {
            alert(`${file.name} exceeds the 10MB limit or is not a supported file type.`);
        }
    });
}

function emitFiles() {
    emit('filesChanged', files.value);
}

function clearFiles() {
    files.value = [];
    emitFiles(); // Синхронизируем состояние после очистки
}

function isSupportedFileType(file: File): boolean {
    const supportedTypes = [
        'image/png',
        'image/jpeg',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return supportedTypes.includes(file.type);
}

function isImage(file: File): boolean {
    return file.type.startsWith('image/');
}

function fileTypeIcon(fileName: string): string {
    if (fileName.endsWith('.pdf')) return '📄 PDF';
    if (fileName.endsWith('.pptx')) return '📊 PPTX';
    if (fileName.endsWith('.docx')) return '📄 DOCX';
    return '📁';
}

function formatFileSize(size: number): string {
    return (size / (1024 * 1024)).toFixed(2) + ' Mb';
}

function triggerFileSelect() {
    fileInput.value?.click();
}

function removeFile(index: number) {
    files.value.splice(index, 1);
    emitFiles();
}

defineExpose({
    triggerFileSelect,
    clearFiles,
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.file-uploader {
    &__input {
        display: none;
    }

    &__previews {
        max-height: 240px;
        display: flex;
        gap: 16px;
        border: 1px dashed $color-border;
        padding: $spacing-md;
        border-radius: 6px;
        position: relative;
        overflow: auto;
    }

    &__preview {
        position: relative;
        width: 80px;
        text-align: center;

        .file-img {
            width: 100%;
            height: 80px;
            margin: 0 0 $spacing-xs;
            object-fit: cover;
            object-position: center;
        }

        .file-icon {
            width: 100%;
            height: 80px;
            margin: 0 0 $spacing-xs;
        }

        .file-info {
            font-size: $font-size-min;

            span {
                display: block;
                width: 72px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .btn-remove {
            width: 24px;
            height: 24px;
            position: absolute;
            top: -12px;
            right: -12px;
            background-color: $color-background-gray-second;
            padding: $spacing-xs;
            border-radius: 50%;

            svg {

                path {
                    transition: fill .4s ease;
                }
            }

            &:hover {

                svg {

                    path {
                        fill: $color-danger;
                    }
                }
            }
        }
    }
}
</style>