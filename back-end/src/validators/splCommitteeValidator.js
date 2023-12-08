import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const createCommitteeSchema = Joi.object({
    splId: Joi.string().trim().uuid().required(),
    head: Joi.string().trim().email().required(),
    manager: Joi.string().trim().email().required(),
    members: Joi.array()
        .min(1)
        .items({
            email: Joi.string().trim().email().required(),
        })
        .required(),
});

const updateCommitteeSchema = Joi.object({});

const addCommitteeHeadSchema = Joi.object({
    email: Joi.string().trim().email().required(),
});

const addSPLManagerSchema = Joi.object({
    email: Joi.string().trim().email().required(),
});

const addCommitteeMemberSchema = Joi.array().items(
    Joi.object({
        email: Joi.string().trim().email().required(),
    })
);

function validateMemberEmailDuplicates(members) {
    const error = {};
    const emails = members.map((member) => member.email);
    emails.forEach((email, index) => {
        if (utils.countOccurrences(emails, email) > 1) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["email"] = {
                msg: "duplicate email not allowed",
                value: email,
            };
        }
    });

    if (Object.keys(error).length === 0) return null;

    return error;
}

export default {
    createCommitteeSchema,
    updateCommitteeSchema,
};
