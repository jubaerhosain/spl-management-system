import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import utils from "../utils/utils.js";

const createTeamSchema = Joi.object({
    splId: Joi.string().trim().uuid().required(),
    teams: Joi.array()
        .min(1)
        .items(
            Joi.object({
                teamName: Joi.string().trim().min(4).required(),
                teamMembers: Joi.array().min(1).items({
                    email: Joi.string().trim().email().required(),
                }),
                details: Joi.string().trim().optional(),
            })
        )
        .required(),
});

function validateTeamMemberEmailDuplicates(teams) {
    const error = {};
    const emails = [];
    teams.forEach((team) => {
        team.teamMembers.forEach((member) => {
            emails.push(member.email);
        });
    });

    teams.forEach((team, teamIndex) => {
        team.teamMembers.forEach((member, memberIndex) => {
            if (utils.countOccurrences(emails, member.email) > 1) {
                if (!error[`teams[${teamIndex}].teamMembers[${memberIndex}].email`]) {
                    error[`teams[${teamIndex}].teamMembers[${memberIndex}].email`] = {
                        msg: "duplicate email not allowed",
                        value: member.email,
                    };
                }
            }
        });
    });

    if (Object.keys(error).length === 0) return null;

    return error;
}

export default { createTeamSchema, validateTeamMemberEmailDuplicates };
