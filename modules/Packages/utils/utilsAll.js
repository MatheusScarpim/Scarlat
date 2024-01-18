const sharp = require("sharp")

function decreaseImageQuality(base64Data, quality) {
    return new Promise((resolve, reject) => {
        try {
            if (!base64Data) {
                reject(new Error('Os dados Base64 estão nulos ou vazios.'));
                return;
            }

            const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

            sharp(buffer)
                .metadata()
                .then(metadata => {
                    const maxWidth = Math.round(metadata.width / 3 + (metadata.width / 3));
                    const maxHeight = Math.round(metadata.height / 3 + (metadata.height / 3));

                    sharp(buffer)
                        .resize({
                            width: maxWidth,
                            height: maxHeight,
                            fit: 'inside',
                        })
                        .jpeg({
                            quality,
                        })
                        .toBuffer()
                        .then(resizedBuffer => {
                            const resizedBase64Data = resizedBuffer.toString('base64');
                            resolve(resizedBase64Data);
                        })
                        .catch(err => {
                            console.error(`Erro ao processar a imagem: ${err}`);
                            reject(err);
                        });
                })
                .catch(err => {
                    console.error(`Erro ao obter metadados da imagem: ${err}`);
                    reject(err);
                });
        } catch (error) {
            console.error(`Erro inesperado: ${error}`);
            reject(error);
        }
    });
}
module.exports.decreaseImageQuality = decreaseImageQuality