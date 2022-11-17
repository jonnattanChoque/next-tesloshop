
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data =
| {message: string}

export const config = {
    api : {
        bodyParser: false
    }
}

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return uploadFiles(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function uploadFiles(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const filePath = await parseFiles(req);

    return res.status(200).json({ message: filePath as string });

}


const parseFiles = async(req: NextApiRequest) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if(err) {
                reject(err);
            }
            const filePath = await saveFile(files.file as formidable.File);
            resolve(filePath);
        });
    })
}

const saveFile = async(file: formidable.File) => {
    // version local
    // const data = fs.readFileSync(file.filepath);
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);
    // fs.unlinkSync(file.filepath);

    // version cloudinary
    const data = await cloudinary.uploader.upload(file.filepath);
    return data.secure_url

    return 
}