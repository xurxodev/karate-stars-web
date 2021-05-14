import mime from "mime-types";

export function base64ImageToFile(base64Image: string, name: string): File {
    let byteString;
    if (base64Image.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Image.split(",")[1]);
    else byteString = unescape(base64Image.split(",")[1]);

    // separate out the mime component
    const mimeString = base64Image.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const fileName = `${convertToSlug(name)}.${mime.extension(mimeString)}`;

    return new File([ia], fileName, { type: mimeString });
}

function convertToSlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}
