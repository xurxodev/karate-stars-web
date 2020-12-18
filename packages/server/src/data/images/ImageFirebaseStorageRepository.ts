import firebaseAdmin from "firebase-admin";
import { Either } from "karate-stars-core";
import { UnexpectedError } from "../../api/common/Errors";
import { ImageRepository, ImageType } from "../../domain/images/boundaries/ImageRepository";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

export class ImageFirebaseStorageRepository implements ImageRepository {
    constructor(private bucketName: string) {}

    async uploadNewFile(
        type: ImageType,
        filename: string,
        readStream: Readable
    ): Promise<Either<UnexpectedError, string>> {
        try {
            const refName = `${type}/${filename}`;
            const extension = filename.split(".").pop() || ".jpg";

            firebaseAdmin.initializeApp();

            const bucket = firebaseAdmin.storage().bucket(this.bucketName);
            const file = bucket.file(`${refName}`);

            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: mime.lookup(extension),
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
}
