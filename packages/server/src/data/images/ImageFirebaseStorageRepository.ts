import firebaseAdmin from "firebase-admin";
import { Either } from "karate-stars-core";
import { UnexpectedError } from "../../api/common/Errors";
import { ImageRepository, ImageType } from "../../domain/images/boundaries/ImageRepository";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

export class ImageFirebaseStorageRepository implements ImageRepository {
    constructor(private bucketName: string) {
        if (!firebaseAdmin.apps.length) {
            firebaseAdmin.initializeApp({});
        } else {
            firebaseAdmin.app(); // if already initialized, use that one
        }
    }

    async uploadNewImage(
        type: ImageType,
        filename: string,
        readStream: Readable
    ): Promise<Either<UnexpectedError, string>> {
        try {
            const refName = `${type}/${filename}`;
            const extension = filename.split(".").pop() || ".jpg";

            const bucket = firebaseAdmin.storage().bucket(this.bucketName);
            const file = bucket.file(`${refName}`);

            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: mime.lookup(extension),
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: "no-cache",
                    // Required for firebase console
                    metadata: {
                        firebaseStorageDownloadTokens: uuidv4(),
                    },
                },
            });

            const result: Promise<string> = new Promise((resolve, reject) => {
                writeStream.on("error", function (err) {
                    console.log({ err });
                    reject(err);
                });
                writeStream.on("finish", async function () {
                    await file.makePublic();

                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${refName}`;
                    resolve(publicUrl);
                });
            });

            readStream.pipe(writeStream);

            const publicUrl = await result;
            return Either.right(publicUrl);
        } catch (error) {
            console.log({ error });
            return Either.left({
                kind: "UnexpectedError",
                error,
            });
        }
    }

    async deleteImage(type: ImageType, filename: string): Promise<Either<UnexpectedError, true>> {
        try {
            const refName = `${type}/${filename}`;

            console.log({ refName });

            const bucket = firebaseAdmin.storage().bucket(this.bucketName);
            const file = bucket.file(`${refName}`);

            await file.delete({ ignoreNotFound: true });

            console.log("delete image ok");

            return Either.right(true);
        } catch (error) {
            return Either.left({ kind: "UnexpectedError", error });
        }
    }
}
