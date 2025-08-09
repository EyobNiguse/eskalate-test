import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { Multer } from 'multer';

import { v4 as uuid } from 'uuid';  
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly uploadPath = path.join(process.cwd(), 'uploads');

    constructor() {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    validateImageFile(file: Multer.File): void {
        // Check file type
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
            );
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size must be less than 5MB.');
        }
    }

    generateFileName(originalName: string): string {
        const fileExtension = extname(originalName);
        const uniqueId = uuid();
        return `${uniqueId}${fileExtension}`;
    }

    async saveFile(file: Multer.File): Promise<string> {
        this.validateImageFile(file);

        const fileName = this.generateFileName(file.originalname);
        const filePath = path.join(this.uploadPath, fileName);

        // Write file to disk
        fs.writeFileSync(filePath, file.buffer);

        return fileName;
    }

    deleteFile(fileName: string): void {
        if (!fileName) return;

        const filePath = path.join(this.uploadPath, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    getFileUrl(fileName: string): string {
        if (!fileName) return '';
        return `/uploads/${fileName}`;
    }
}
