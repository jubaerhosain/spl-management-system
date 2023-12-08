import { models } from "../configs/mysql.js";

async function createPresentation(presentation) {
    await models.Presentation.create(presentation);
}

async function findPresentation(splId, presentationNo) {
    const presentation = await models.Presentation.findOne({
        where: {
            splId,
            presentationNo,
        },
    });
    return presentation;
}

async function findPresentationById(presentationId) {}

export default {
    createPresentation,
    findPresentation,
    findPresentationById,
};
