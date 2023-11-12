use anchor_lang::prelude::*;

#[error_code]
pub enum IdeaError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Not allowed.")]
    NotAllowed,
    #[msg("Idea can't be empty.")]
    IdeaNotEmpty,
}