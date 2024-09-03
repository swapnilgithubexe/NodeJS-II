// Kindly do not modify this file

import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import {glob} from 'glob';
import FormData from 'form-data';
import axios from 'axios';


const directoryPath = './'; // Current directory path

const token = process.argv[2];

if (!token) {
    console.error('No JWT token provided!');
    process.exit(1); // Exit the process with a non-zero status code
}
const output = fs.createWriteStream('zipped_file.zip');
const archive = archiver('zip', {
    zlib: { level: 9 } // Set compression level, higher the compression level, lower the size
});

archive.on('error', (err) => {
    if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
        console.log('File deleted due to error');
    }
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Exclude node_modules and gather all files and folders synchronously
const files = glob.sync('**', {
    cwd: directoryPath,
    ignore: 'node_modules/**' // Exclude node_modules directory
});

files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const relativePath = path.relative(directoryPath, filePath);
    archive.file(filePath, { name: path.join('zipped_file', relativePath) });
});

// Finalize the archive and listen for completion
archive.finalize();

const zipFilePath = 'zipped_file.zip';
const maxSizeAllowed = 50 * 1024 * 1024; // 20MB in bytes
output.on('close', async () => {
    console.log('Zip file created successfully');
    const stats = fs.statSync('zipped_file.zip');
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes <= maxSizeAllowed) {
        try {
            const formData = new FormData();
            formData.append('submission_file', fs.createReadStream('zipped_file.zip'));
            formData.append('token', token);
            const response = await axios.post(
                'https://api.codingninjas.com/api/v3/problem_submission_via_script',
                formData,
                {
                    headers: formData.getHeaders(),
                    maxContentLength: Infinity,
                }
            );

            console.log('Submission successful. Response status code:', response.status, ' message: ', response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error.message) {
                const errorMessage = error.response.data.error.message;
                console.log('Error Message:', errorMessage);
            } else {
                console.error('Error:', error.message);
            }
        } finally {
            // Delete the file whether the request succeeded or failed
            if (fs.existsSync(zipFilePath)) {
                fs.unlink(zipFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
        }
    } else {
        console.log('Size of submission file must be less than 50 MB');
        if (fs.existsSync(zipFilePath)) {
            fs.unlink(zipFilePath);
            console.log('File deleted due to error');
        }
    }
});