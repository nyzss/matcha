import fs from "fs";
import pump from "pump";

import { v4 as uuidv4 } from 'uuid';

const path = "./src/app/medias";
export const uploadFile = async (file: any): Promise<string> => {
    const UUID = uuidv4();

    const storedFile = fs.createWriteStream(`${path}/${UUID}.png`);
    pump(file, storedFile)
    return `${UUID}.png`;
}

export const deleteFile = async (filename: string) => {
    return new Promise<any>((resolve, reject) => {
        fs.unlink(`${path}/${filename}`, (err) => {
            if (err)
                resolve(false);
            resolve(true);
        });

    });
}

export const getImage = async (filename: string) => {
    try {
        const image = fs.readFileSync(`${path}/${filename}`);

        console.log(image)
        if (!image)
            throw new Error("File not found");
    } catch (error) {
        throw new Error("File not found");
    }
}